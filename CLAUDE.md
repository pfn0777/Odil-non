# Issiq NON — Telegram Mini App

## Loyiha haqida

Yog'li non buyurtma berish uchun Telegram Mini App. Foydalanuvchi nonlarni tanlab savatga qo'shadi va `Telegram.WebApp.sendData()` orqali buyurtmani botga yuboradi.

## Fayl tuzilmasi

```
index.html       — butun app (CSS + JS bitta faylda)
prices.json      — runtime'da yuklanadigan narxlar
images/          — mahsulot rasmlari: yogli_non_1.jpg ... yogli_non_14.jpg
docs/specs/      — deployment va mahsulot spesifikatsiyalari
```

**Hech qanday build tool yo'q** — faqat vanilla HTML/CSS/JS.

## Mahsulotlar

14 ta "Yog'li non" (`yogli_non_1` ... `yogli_non_14`), hammasi 3 000 so'm.

- Mahsulot kalitlari: `yogli_non_1` ... `yogli_non_14`
- Narxlar `prices.json` dan runtime'da yuklanadi
- Rasm yo'q bo'lsa emoji fallback (`🫓`) ishlaydi
- `CATS` array (`index.html:780`) — kategoriya va mahsulot ma'lumotlari
- `EM` object (`index.html:801`) — har bir kalit uchun emoji

## Telegram integratsiya

```js
Telegram.WebApp.ready()       // app tayyor
Telegram.WebApp.expand()      // to'liq ekran
Telegram.WebApp.sendData(json) // buyurtma yuborish
Telegram.WebApp.HapticFeedback.impactOccurred('light'|'medium'|'heavy')
```

Checkout JSON formati:
```json
{ "action": "checkout", "items": [{ "item_key": "yogli_non_1", "quantity": 2 }] }
```

## Asosiy funksiyalar (index.html)

| Funksiya | Qator | Vazifasi |
|---|---|---|
| `build()` | ~818 | DOM render qiladi (kartalar + tablar) |
| `mkCard(item)` | ~846 | Bitta mahsulot kartasi |
| `add(k)` | ~880 | Savatga qo'shish (+1) |
| `dec(k)` | ~885 | Miqdorni kamaytirish |
| `syncCard(k)` | ~892 | Karta holatini yangilash |
| `syncBar()` | ~906 | Bottom cart bar yangilash |
| `openCart()` | ~918 | Cart sheet ochish |
| `renderSheet()` | ~929 | Sheet ichini render qilish |
| `checkout()` | ~974 | Buyurtma yuborish |

## Karta klik logikasi

- **Rasm ustiga klik** → faqat savat bo'sh bo'lsa `add()` chaqiriladi (`if (!cart[item.key]) add(item.key)`)
- **`+` tugma klik** → har doim `add()` chaqiriladi
- **`−` tugma klik** → `dec()` chaqiriladi
- Savat borligida karta `in-cart` class oladi va `qty-overlay` ko'rinadi

## Dizayn tizimi (CSS tokens)

```css
--cream / --cream2 / --cream3 / --cream4   /* fon ranglari */
--crust / --crust2 / --crust-soft          /* asosiy accent (jigarrang) */
--wheat / --wheat2 / --wheat-soft          /* ikkilamchi accent (sariq) */
--dough / --dough2                         /* karta foni */
--text / --text2 / --text3                 /* matn ranglari */
```

Fontlar: `Playfair Display` (sarlavhalar) + `Nunito` (asosiy matn).

## Narxlarni o'zgartirish

`prices.json` faylini tahrirlash kifoya:
```json
{ "yogli_non_1": 3000, "yogli_non_2": 3500, ... }
```
Kalit `CATS` array'dagi `item.key` bilan mos kelishi shart.

## Deploy

- **Platform**: Vercel (static hosting)
- **Metod**: GitHub repo → Vercel git integration
- `prices.json` va `images/` papkasi avtomatik serve qilinadi
- `.vercel` konfiguratsiya kerak emas

## Muhim cheklovlar

- Backend yo'q — faqat statik fayl
- Telefon/manzil kiritish yo'q — bot tomonida hal qilinadi
- To'lov tizimi yo'q
- Foydalanuvchi tarixi saqlanmaydi
- `images/logo.png` yo'q bo'lsa header `🍞` emoji ko'rsatadi
