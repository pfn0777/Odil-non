# Spec: Issiq NON — Telegram Mini App

## Maqsad
Non mahsulotlari uchun bir sahifali Telegram Mini App.
Foydalanuvchi nonni tanlab buyurtma beradi, bot telefon raqamini so'raydi, admin bilan bog'lanadi.

## Qamrov ICHIDA
- `index.html` — bitta fayl, vanilla JS + CSS variables
- 14 ta "Yog'li non" mahsuloti, bitta "Nonlar" kategoriyasi
- Grid card layout: rasm (fallback: emoji) + nom + narx
- Savatga qo'shish / miqdor boshqaruvi (+ / −)
- Bottom cart bar (jami narx + "Savatni ko'rish")
- Cart sheet/drawer (barcha tanlangan nonlar ro'yxati)
- "Buyurtma berish" → Telegram.WebApp.sendData(JSON)
- `prices.json` — narxlarni runtime'da yuklash
- Rang sxemasi: issiq jigarrang (--crust) + sariq (--wheat) + krema (--cream)

## Qamrov TASHQARISIDA
- Telefon raqam inputi mini-app ichida yo'q — botning ishi
- Manzil kiritish yo'q
- To'lov tizimi yo'q
- Admin panel yo'q
- Foydalanuvchi tarixi yo'q
- Dark/light tema yo'q

## Texnik
- Fayl: `index.html` (ichida CSS + JS)
- Rasmlar: `images/yogli_non_1.jpg` ... `images/yogli_non_14.jpg`
- Narxlar: `prices.json` — DOMContentLoaded da yuklanadi, fallback inline narx
- Telegram API: `sendData()`, `HapticFeedback`, `expand()`, `ready()`
- Font: Playfair Display + Nunito (Google Fonts, lazy load)
- Deploy: Vercel (statik hosting, `vercel.json` kerak emas)

## Non mahsulotlari

| Key           | Nom            | Narx       |
|---------------|----------------|------------|
| yogli_non_1   | Yog'li non 1   | 3 000 so'm |
| yogli_non_2   | Yog'li non 2   | 3 000 so'm |
| yogli_non_3   | Yog'li non 3   | 3 000 so'm |
| yogli_non_4   | Yog'li non 4   | 3 000 so'm |
| yogli_non_5   | Yog'li non 5   | 3 000 so'm |
| yogli_non_6   | Yog'li non 6   | 3 000 so'm |
| yogli_non_7   | Yog'li non 7   | 3 000 so'm |
| yogli_non_8   | Yog'li non 8   | 3 000 so'm |
| yogli_non_9   | Yog'li non 9   | 3 000 so'm |
| yogli_non_10  | Yog'li non 10  | 3 000 so'm |
| yogli_non_11  | Yog'li non 11  | 3 000 so'm |
| yogli_non_12  | Yog'li non 12  | 3 000 so'm |
| yogli_non_13  | Yog'li non 13  | 3 000 so'm |
| yogli_non_14  | Yog'li non 14  | 3 000 so'm |

Narxni o'zgartirish: `prices.json` dagi mos kalitni tahrirlash kifoya.

## Karta klik logikasi

- Rasm klik → savatda YO'Q bo'lsa: +1 qo'shadi; savatda BOR bo'lsa: hech narsa qilmaydi
- `+` tugma → har doim +1
- `−` tugma → −1, 0 bo'lsa savatdan o'chiradi

## Checkout JSON

```json
{
  "action": "checkout",
  "items": [
    { "item_key": "yogli_non_1", "quantity": 2 },
    { "item_key": "yogli_non_5", "quantity": 1 }
  ]
}
```

## Acceptance criteria

- [ ] App Telegram WebApp'da ochiladi va `expand()` ishlaydi
- [ ] 14 ta non karta ko'rinadi, rasm bo'lmasa `🫓` emoji fallback ishlaydi
- [ ] Rasm klik: savatda yo'q → +1; savatda bor → hech narsa
- [ ] `+` / `−` tugmalar to'g'ri ishlaydi
- [ ] Bottom cart bar faqat savat to'liq bo'lganda ko'rinadi
- [ ] Cart sheet ochiladi, jami narx to'g'ri hisoblanadi
- [ ] "Buyurtma berish" → `sendData` JSON yuboradi
- [ ] `prices.json` dan narxlar yuklanadi, yuklanmasa inline fallback ishlaydi
- [ ] Mobil qurilmada safe area to'g'ri ishlaydi
