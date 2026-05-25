# Spec: Deploy Readiness — Vercel'ga chiqishdan oldingi tuzatishlar

## Maqsad
Issiq NON Telegram Mini App'ni Vercel'ga deploy qilishdan oldin aniqlangan 2 ta teknik bug'ni tuzatish va deploy jarayonini bajarish.

## Nega kerak
Code review (2026-05-25) da aniqlandi:
- Karta rasmiga bosish miqdorni kutilmaganda oshirib yuboradi (UX regression)
- Favicon'dagi raw SVG HTML attribute'da noto'g'ri format (Firefox'da <head> misparsed bo'lishi mumkin)

## Qamrov ICHIDA
- `card-img` click handlerida guard qaytarish: faqat birinchi qo'shishda ishlaydi
- Favicon `href`ini URL-encode qilish (raw `<svg` → `%3Csvg`)
- Vercel'ga deploy: `index.html`, `prices.json`, `images/` papkasi

## Qamrov TASHQARISIDA (bularni qilma!)
- Yangi feature qo'shish — deploy'dan keyin
- inline onclick'larni DOM API'ga o'tkazish (innerHTML XSS refactor) — data hardcoded, hozir xavfsiz, keyingi sprint
- Backend/server logikasi — bu statik sayt, hozircha kerak emas
- Auth / Telegram initData validatsiya — server yo'q, keyin

## Texnik
- Fayl: `index.html` (2 ta o'zgarish)
- Deploy: Vercel (statik sayt, `vercel.json` kerak emas)
- DB: yo'q
- Config: yo'q (prices.json statik fayl sifatida serve bo'ladi)

## Qoidalar

### Bug 1 — card-img guard
- QACHON foydalanuvchi karta rasmiga bosadi
  VA mahsulot savatda allaqachon bor (`cart[item.key]` truthy)
  TIZIM miqdorni OSHIRMASLIGI SHART
  VA faqat qty-overlay orqali (+/- tugmalar) oshirish ishlashi SHART

- QACHON foydalanuvchi karta rasmiga bosadi
  VA mahsulot savatda yo'q
  TIZIM 1 ta qo'shishi SHART

### Bug 2 — favicon encoding
- TIZIM favicon `href`'ini RFC 2397 bo'yicha URL-encode qilingan shaklda berishi SHART
- `<` → `%3C`, `>` → `%3E`, `'` → `%27` (SVG namespace atributida)

## Acceptance criteria
- [ ] Karta rasmiga bosish — savatda bo'lmasa +1, bo'lsa hech narsa bo'lmaydi
- [ ] Qty-overlay +/- tugmalari avvalgidek ishlaydi
- [ ] Favicon brauzer tabida ko'rinadi (Chrome + Firefox)
- [ ] Vercel deploy muvaffaqiyatli yakunlanadi
- [ ] `prices.json` va `images/*.jpg` to'g'ri yuklanadi (network tab tekshiriladi)
- [ ] Telegram Mini App sifatida ochiladi, `Telegram.WebApp` undefined bo'lmaydi
