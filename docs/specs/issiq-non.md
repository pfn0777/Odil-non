# Spec: Issiq NON — Telegram Mini App

## Maqsad
BEK BURGER mini-app'i uslubida, non mahsulotlari uchun bir sahifali Telegram Mini App.
Foydalanuvchi nonni tanlab buyurtma beradi, bot telefon raqamini so'raydi, admin bilan bog'lanadi.

## Qamrov ICHIDA
- `index.html` — bitta fayl, vanilla JS + CSS variables
- Dark/light tema toggle (sticky header'da)
- 10 ta non mahsuloti, bitta "Nonlar" kategoriyasi
- Grid card layout: rasm (placeholder) + nom + narx
- Savatga qo'shish / miqdor boshqaruvi (+ / −)
- Bottom cart bar (jami narx + "Savatni ko'rish")
- Cart sheet/drawer (barcha tanlangan nonlar ro'yxati)
- "Buyurtma berish" → Telegram.WebApp.sendData(JSON)
- prices.json — narxlarni alohida boshqarish
- Placeholder logo (emoji 🍞)
- Rang sxemasi: issiq jigarrang + sariq

## Qamrov TASHQARISIDA
- Telefon raqam inputi mini-app ichida yo'q — botning ishi
- Manzil kiritish yo'q
- To'lov tizimi yo'q
- Admin panel yo'q
- Foydalanuvchi tarixi yo'q

## Texnik
- Fayl: index.html (bitta fayl, ichida CSS + JS)
- Rasmlar: images/<non_key>.jpg — foydalanuvchi almashtiradi
- Narxlar: prices.json — runtime'da yuklanadi
- Telegram API: sendData(), HapticFeedback, expand(), ready()
- Font: Cinzel + Raleway (Google Fonts)

## Non mahsulotlari
| Key              | Nom             | Narx       |
|------------------|-----------------|------------|
| oq_non           | Oq Non          | 3 000 so'm |
| bugdoy_non       | Bug'doy Noni    | 4 000 so'm |
| kulcha           | Kulcha          | 5 000 so'm |
| patir            | Patir           | 6 000 so'm |
| qatlama          | Qatlama         | 7 000 so'm |
| somsa            | Somsa           | 5 000 so'm |
| kunjutli_somsa   | Kunjutli Somsa  | 6 000 so'm |
| lavash           | Lavash          | 4 000 so'm |
| baursak          | Baursak (1 pors)| 8 000 so'm |
| tandir_non       | Tandir Noni     | 10 000 so'm|

## Checkout JSON
```json
{
  "action": "checkout",
  "items": [
    { "item_key": "kulcha", "quantity": 2 },
    { "item_key": "patir", "quantity": 1 }
  ]
}
```

## Acceptance criteria
- [ ] App Telegram WebApp'da ochiladi va expand() ishlaydi
- [ ] 10 ta non karta ko'rinadi, rasm bo'lmasa emoji fallback ishlaydi
- [ ] Savatga qo'shish / + / − to'g'ri ishlaydi
- [ ] Bottom cart bar faqat savat bo'lganda ko'rinadi
- [ ] Cart sheet ochiladi, jami narx to'g'ri hisoblanadi
- [ ] "Buyurtma berish" → sendData JSON yuboradi
- [ ] prices.json dan narxlar yuklanadi
- [ ] Dark/light tema ishlaydi, localStorage'da saqlanadi
- [ ] Mobil qurilmada safe area to'g'ri ishlaydi
