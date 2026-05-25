import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const prices = require('../prices.json');

function validateInitData(initData, botToken) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;
    params.delete('hash');
    const dataString = [...params.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const expected = crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
    return expected === hash;
  } catch {
    return false;
  }
}

function itemName(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatOrder(items) {
  let total = 0;
  const lines = items.map(({ item_key, quantity }) => {
    const price = prices[item_key] ?? 3000;
    const subtotal = price * quantity;
    total += subtotal;
    return `  ${itemName(item_key)} x${quantity} — ${subtotal.toLocaleString('ru')} so'm`;
  });
  return { lines: lines.join('\n'), total };
}

async function sendMessage(botToken, chatId, payload) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body = typeof payload === 'string'
    ? { chat_id: chatId, text: payload, parse_mode: 'HTML' }
    : { chat_id: chatId, parse_mode: 'HTML', ...payload };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram API error: ${text}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.error('BOT_TOKEN yoki ADMIN_CHAT_ID env yo\'q');
    return res.status(500).json({ error: 'server misconfigured' });
  }

  const { initData, items } = req.body ?? {};

  if (!initData || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'initData va items majburiy' });
  }

  if (!validateInitData(initData, BOT_TOKEN)) {
    return res.status(401).json({ error: 'initData yaroqsiz' });
  }

  let user;
  try {
    user = JSON.parse(new URLSearchParams(initData).get('user') ?? '{}');
  } catch {
    return res.status(400).json({ error: 'user parse xatosi' });
  }

  const userId = user.id;
  const userName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Noma\'lum';
  const userLink = user.username
    ? `<a href="https://t.me/${user.username}">${userName}</a>`
    : `${userName} (ID: ${userId})`;

  const { lines, total } = formatOrder(items);
  const totalFormatted = total.toLocaleString('ru') + ' so\'m';

  const adminText =
    `🆕 Yangi zakaz!\n` +
    `👤 Ism: ${userLink}\n` +
    `🔗 Telegram ID: ${userId}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${lines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💰 Jami: ${totalFormatted}`;

  const userPayload = {
    text:
      `Buyurtmangiz qabul qilindi!\n` +
      `━━━━━━━━━━━━━━━\n` +
      `${lines}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `Jami: ${totalFormatted}\n\n` +
      `Tasdiqlash uchun telefon raqamingizni yuboring:`,
    reply_markup: {
      keyboard: [[{ text: '📱 Raqamni ulashish', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  try {
    await Promise.all([
      sendMessage(BOT_TOKEN, ADMIN_CHAT_ID, adminText),
      sendMessage(BOT_TOKEN, userId, userPayload),
    ]);
  } catch (err) {
    console.error('Telegram xabar yuborishda xato:', err);
    return res.status(502).json({ error: 'xabar yuborib bo\'lmadi' });
  }

  return res.status(200).json({ ok: true });
}
