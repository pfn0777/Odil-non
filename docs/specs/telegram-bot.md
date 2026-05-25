# Spec: Issiq NON — Telegram Bot

## Maqsad
Mini app orqali kelgan buyurtmani qabul qilib, foydalanuvchidan telefon raqam olib,
tasdiqlash xabarini foydalanuvchiga va admin xabarini adminga yuboradigan Telegram bot.

## Nega kerak
Mini app (`index.html`) faqat `sendData()` yuboradi — uni qabul qilib ishlaydigan bot yo'q.
Bot shu bo'shliqni to'ldiradi: zakaz → telefon → tasdiq → admin xabari.

## Qamrov ICHIDA
- `/start` → "Mini appni ochish" tugmasi
- `web_app_data` handler → mini appdan buyurtma qabul qilish
- Contact so'rash → foydalanuvchiga telefon tugmasi yuborish
- Contact handler → foydalanuvchiga tasdiq, adminga xabar
- `.env` — `BOT_TOKEN` va `ADMIN_CHAT_ID`
- `requirements.txt` — `aiogram`, `python-dotenv`

## Qamrov TASHQARISIDA
- To'lov tizimi yo'q
- Zakaz tarixi/bazasi yo'q — faqat in-memory (bot restart = yo'qoladi)
- Admin panel yo'q
- Buyurtma bekor qilish yo'q
- Ko'p til yo'q — faqat o'zbek

## Buyurtma oqimi (step by step)

```
1. /start
   Bot: [Mini appni ochish] tugmasi

2. Foydalanuvchi mini appda non tanlaydi → "Buyurtma berish" bosadi
   Mini app: sendData({ action: "checkout", items: [...] })

3. Bot web_app_data qabul qiladi
   Bot: "Buyurtmangiz qabul qilindi! Telefon raqamingizni yuboring."
        [📱 Raqamni ulashish] tugmasi (ReplyKeyboardMarkup, one_time)

4. Foydalanuvchi contact yuboradi
   Bot: Pending orders'dan zakaz ma'lumotini oladi

5. Bot → foydalanuvchiga tasdiq:
   "✅ Zakaringiz qabul qilindi!
    ━━━━━━━━━━━━━━━
    [mahsulot nomi x miqdor — narx]
    ━━━━━━━━━━━━━━━
    Jami: X 000 so'm
    Tez orada siz bilan bog'lanamiz!"

6. Bot → adminga xabar:
   "🆕 Yangi zakaz!
    👤 Ism: [Telegram ismi]
    📞 Telefon: +998XXXXXXXXX
    ━━━━━━━━━━━━━━━
    [mahsulot nomi x miqdor — narx]
    ━━━━━━━━━━━━━━━
    💰 Jami: X 000 so'm"
```

## Texnik

- Til: **Python 3.11+**
- Framework: **aiogram 3.x** (async)
- Secrets: `python-dotenv` → `.env` fayl
- Pending orders: `dict[user_id → order_data]` (in-memory)
- Rejim: **polling** (webhook emas — sodda va tez)
- Fayl tuzilmasi:
  ```
  bot/
    bot.py          — asosiy bot fayl
    .env            — BOT_TOKEN, ADMIN_CHAT_ID
    .env.example    — namuna (git'ga kiradi)
    requirements.txt
  ```

## Narxlar hisoblash

`prices.json` botda ham o'qiladi — har bir `item_key` uchun narx olinadi.
`prices.json` yo'q bo'lsa fallback: 3000 so'm.

```python
# Jami hisoblash
total = sum(prices.get(item["item_key"], 3000) * item["quantity"] for item in items)
```

## Mahsulot nomi mapping

`yogli_non_1` → `Yog'li non 1` (raqamni key'dan ajratib olish).

## .env tuzilmasi

```env
BOT_TOKEN=7xxxxxxxxx:AAxxxxxxxxxxxxxxxxxxxxx
ADMIN_CHAT_ID=123456789
MINI_APP_URL=https://issiq-non.vercel.app
```

## Qoidalar (logika)

- QACHON foydalanuvchi `/start` yuborganda
  TIZIM `WebApp` tugmali xabar yuborishi SHART

- QACHON `web_app_data` kelganda
  VA `action == "checkout"` bo'lganda
  TIZIM `pending_orders[user_id]` ga saqlashi SHART
  VA contact so'rash xabari yuborishi SHART

- QACHON contact kelganda
  VA `pending_orders[user_id]` mavjud bo'lganda
  TIZIM foydalanuvchiga tasdiq yuborishi SHART
  VA adminga xabar yuborishi SHART
  VA `pending_orders[user_id]` ni o'chirishi SHART

- AGAR contact kelganda `pending_orders[user_id]` YO'Q bo'lsa
  TIZIM "Avval mini appdan buyurtma bering" deb javob berishi SHART

- AGAR `web_app_data` JSON parse xatosi bo'lsa
  TIZIM xatoni log qilishi SHART
  VA foydalanuvchiga "Xatolik yuz berdi, qaytadan urinib ko'ring" deb javob berishi SHART

## Acceptance criteria

- [ ] `/start` → mini app tugmasi ko'rinadi
- [ ] Mini appdan buyurtma keladi → bot contact so'raydi
- [ ] Contact yuboriladi → foydalanuvchiga tasdiq xabari keladi
- [ ] Adminga to'liq zakaz xabari (telefon + mahsulotlar + jami) keladi
- [ ] Jami narx `prices.json` ga mos to'g'ri hisoblanadi
- [ ] Contact yuborilsa lekin oldin zakaz berilmagan bo'lsa → to'g'ri xabar
- [ ] `.env` dagi `BOT_TOKEN` noto'g'ri bo'lsa bot aniq xato beradi
