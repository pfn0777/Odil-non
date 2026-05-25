# Spec: Telefon raqam yig'ish (API flow)

## Maqsad
Mini app orqali zakaz bergandan so'ng foydalanuvchidan telefon raqam olinsin
va admin zakazni to'liq ma'lumot bilan olsin (ism + raqam + items).

## Nega kerak
Hozir admin zakazni oladi lekin telefon yo'q — mijoz bilan bog'lana olmaydi.

## Qamrov ICHIDA
- `api/order.js`: zakaz adminga + foydalanuvchiga "raqam yuboring" keyboard yuboradi
- `bot.py`: `handle_contact` qaytariladi — raqamni adminga yuboradi, foydalanuvchini tasdiqlab keyboard yopadi

## Qamrov TASHQARISIDA
- Zakazni raqam bilan birga bitta xabarda yuborish — shared state kerak (keyingi versiya)
- Raqamni DB ga saqlash — keyingi versiya

## Texnik

### `api/order.js` o'zgarishi
`sendMessage` da foydalanuvchiga contact keyboard qo'shiladi:
```json
{
  "chat_id": userId,
  "text": "Buyurtmangiz qabul qilindi!\n\nTasdiqlash uchun telefon raqamingizni yuboring:",
  "reply_markup": {
    "keyboard": [[{"text": "📱 Raqamni ulashish", "request_contact": true}]],
    "resize_keyboard": true,
    "one_time_keyboard": true
  }
}
```

### `bot.py` o'zgarishi
`handle_contact` handler qaytariladi:
- Foydalanuvchi contact yuborsa → adminga alohida xabar: "📞 [ism]: [raqam]"
- Foydalanuvchiga: "Rahmat! Tez orada siz bilan bog'lanamiz 🙏" + keyboard yopiladi

## Qoidalar

- QACHON Vercel API order qabul qilsa
  TIZIM adminga zakaz xabari yuborishi SHART (ism, Telegram ID, items, jami)
  VA foydalanuvchiga "raqam yuboring" keyboard yuborishi SHART

- QACHON foydalanuvchi contact ulashsa
  TIZIM adminga "📞 [ism]: [raqam]" xabari yuborishi SHART
  VA foydalanuvchiga tasdiq xabari + ReplyKeyboardRemove yuborishi SHART

- AGAR foydalanuvchi contact ulashmasa (keyboard yopib ketsa)
  TIZIM hech narsa qilmasligi SHART (majburiy emas)

## Acceptance criteria
- [ ] Zakaz bergandan so'ng bot "raqam yuboring" klaviatura ko'rsatadi
- [ ] Foydalanuvchi raqam ulashganda admin "📞 ism: raqam" xabar oladi
- [ ] Foydalanuvchiga tasdiq xabari keladi va keyboard yopiladi
- [ ] Admin avval zakaz, keyin raqam — ikki alohida xabar oladi
