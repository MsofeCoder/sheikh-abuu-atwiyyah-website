# Mwongozo wa Mtumiaji — Tovuti ya Sheikh Abuu Atwiyyah

Mwongozo huu umeandikwa kwa **mtumiaji asiye na ujuzi wa kiufundi**. Hakuna
haja ya kujua code, GitHub, au Netlify — kila kitu kinaelezwa hatua kwa hatua.

---

## 1. Tovuti iko wapi?

| Nini | Anwani (URL) |
|---|---|
| Tovuti ya wageni (live) | `https://abuuatwiyyah.netlify.app/` |
| Jopo la uongozi (admin) | `https://abuuatwiyyah.netlify.app/admin/` |

Tovuti ni **ukurasa mmoja** kwa lugha ya Kiswahili unaoonyesha huduma za
Sheikh Abuu Atwiyyah: mafunzo ya kabla ya ndoa, utatuzi wa migogoro ya
familia, na malezi ya Kiislamu. Wageni wanaweza kupakua vitabu, kusoma
makala, na **kuweka miadi** kupitia WhatsApp.

---

## 2. Wageni wanaona nini (na hufanya nini)?

Tovuti ina sehemu zifuatazo (hutembea kwa kusonga skrini au kupitia menyu
juu):

1. **Mwanzo (Hero)** — Utangulizi na vitufe viwili: "Weka Miadi Sasa" na
   "Angalia Huduma Zetu".
2. **Kuhusu** — Taarifa kuhusu Sheikh na takwimu (miaka ya uzoefu, familia
   zilizosaidiwa, n.k.).
3. **Huduma** — Aina tatu za huduma zinazotolewa.
4. **Masaa ya Kazi** — Muda wa kufunguliwa kila siku.
5. **Maktaba ya Rasilimali** — Vitabu vya PDF, makala, na audio/video za
   bure. Wageni wanapobofya "Pakua PDF" kitabu kinapakuliwa moja kwa moja;
   pale kiungo hakipo, wanabofya "Omba kiungo" na kupewa kiungo kupitia
   WhatsApp.
6. **Mabango** — Matangazo yanayotumika kwenye mitandao ya kijamii.
7. **Ushuhuda** — Nukuu za kheri kutoka kwa wateja (zinazoteleza).
8. **Maswali (FAQ)** — Majibu ya maswali ya kawaida.
9. **Miadi / Wasiliana** — Kalenda ya kuchagua tarehe, fomu ya miadi, na
   namba za simu/WhatsApp.

**Njia za mteja kuwasiliana:**
- Kitufe cha "Weka Miadi" kwenye kalenda na fomu ya miadi.
- Kitufe cha simu: `+255 679 155 676`.
- Barua pepe: `sheikhabuuatwiyyah@gmail.com` (inapokea ujumbe wa fomu ya miadi).
- Kitufe cha WhatsApp kinachoelea chini kulia (kwenye simu, pia upo chini ya
  skrini).

---

## 3. Miadi inafikaje kwako?

Fomu ya miadi (sehemu ya "Weka Miadi Yako ya Faragha") haihitaji database
yoyote. Mteja atakapojaza na kubofya **"Tuma kupitia WhatsApp"**:

1. Ujumbe huandaliwa moja kwa moja (jina, namba ya simu, huduma, tarehe,
   muda, na ujumbe).
2. Ujumbe hutumwa kwenye fomu ya Netlify (unaweza kuona kwenye dashboard ya
   Netlify) na WhatsApp yako (`+255 679 155 676`) inafunguliwa ikiwa na ujumbe tayari.
3. Unamjibu mteja kama kawaida, na unathibitisha miadi.

> **Barua pepe ya fomu:** Ujumbe wa fomu hupelekwa kwenye
> `sheikhabuuatwiyyah@gmail.com` kupitia Netlify Forms. Sandika muundo huu
> (kwa mtu yeyote anayesimamia tovuti) ili ujumbe ufike kwenye barua pepe:
> Netlify Dashboard → Forms → Notifications → Add notification → Email
> notification, recipient `sheikhabuuatwiyyah@gmail.com`.

> **Kumbuka:** Kufunga tarehe kwenye kalenda **si otomatiki** — wewe
> unaweka alama mwenyewe baada ya kuthibitisha miadi (ona hatua 4a hapa
> chini). Hivyo ndivyo tovuti hii inavyofanya kazi kwa usalama na udhibiti
> kamili kwako.

---

## 4. Kuingia kwenye jopo la uongozi (/admin)

1. Fungua `https://abuuatwiyyah.netlify.app/admin/`
2. Ingia na **barua pepe na nenosiri** ulizowekwa wakati wa mwaliko wa
   kwanza (tazama `ADMIN-SETUP.md` ikiwa haujafanya hii bado).
3. Kisha utaona menyu ya kulia yenye vikundi vifuatavyo:
   - **Ushuhuda (Testimonials)**
   - **Rasilimali (Vitabu, Makala, Audio/Video)**
   - **Mabango (Posters)**
   - **Kalenda ya Miadi (Booking Calendar)**
   - **Mipangilio ya Tovuti (Masaa ya Kazi)**

---

## 5. Kazi za kila siku (hatua kwa hatua)

### a) Kutia alama tarehe imejaa (kazi muhimu zaidi)

Mteja akithibitishiwa miadi, weka tarehe hiyo kwenye kalenda ili wengine
wasionekane:

1. Fungua `/admin` → **Kalenda ya Miadi (Booking Calendar)**.
2. Chini ya **"Tarehe Zilizojaa"** bofya **"Add"** (ongeza).
3. Chagua **Tarehe** (mfano `2026-08-25`).
4. Unaweza kuongeza kumbukumbu (hiari), kama "Kikao cha faragha".
5. Bofya **"Publish"** / **"Save"** (hifadhi).

Baada ya muda mfupi, tarehe hiyo itaonekana na **alama ya kufuli (lock)** na
rangi tofauti kwenye kalenda ya tovuti. Wageni hawataweza kuiweka miadi.

### b) Kubadilisha masaa ya kazi

1. `/admin` → **Mipangilio ya Tovuti** → **"Masaa ya Kazi"**.
2. Hariri siku na muda wowote (mfano: "Ijumaa: 9:00 – 12:00").
3. Hifadhi.

### c) Kubadilisha siku za wiki zilizofungwa

1. `/admin` → **Mipangilio ya Tovuti** → **"Siku za Wiki Zilizofungwa"**.
2. Chagua siku ambazo hazipaswi kuweza kubofywa kwenye kalenda (mfano
   Jumapili). Siku hizo zinaonyesha **alama ya mwezi** kwenye kalenda.
3. Hifadhi.

### d) Kubadilisha muda wa vikao (time slots)

Muda huu ndio unaoonyeshwa kwenye fomu ya miadi baada ya mteja kuchagua
tarehe.

- **Muda wa kawaida** → "Muda wa Vikao (Time slots)": muda wa kila siku.
- **Siku maalum** → "Muda wa Vikao kwa Siku Maalum": mfano Ijumaa kuwa na
  muda tofauti.
- **Tarehe maalum** → "Muda wa Vikao kwa Tarehe Maalum": muda maalum kwa
  siku moja pekee (mfano sherehe). Hii inatangulia kuliko muda wa siku.

Mfano: Ijumaa asili ni `9:00 – 12:00` mchana; kwa hiyo muda wa vikao wa
Ijumaa unaweza kuwa tofauti na Jumatatu. Hakikisha muda hauingii kwenye
masaa ya kazi.

### e) Kuongeza / kuhariri ushuhuda

1. `/admin` → **Ushuhuda (Testimonials)** → bofya kwenye orodha.
2. **"Add"** ili kuongeza nukuu mpya: andika **Nukuu**, **Jina la Mteja**,
   na **Mahali**.
3. Kuondoa ushuhuda usiohitajika, bofya **"Remove"** (kuondoa) kwenye
   kipengele hicho.
4. Hifadhi.

### f) Rasilimali (vitabu vya PDF, makala, audio/video)

1. `/admin` → **Rasilimali (Vitabu, Makala, Audio/Video)**.
2. Chagua aina: **PDF**, **Makala**, **Audio**, au **Video**.
3. Andika **Kichwa** na **Maelezo Mafupi**.
4. Sehemu ya **"Faili la PDF au Kiungo cha Audio/Video"**:
   - Ukipakia faili/kiungo, mteja atafungua au kupakua moja kwa moja
     (PDF zinapakuliwa; weka PDF za vitabu kwenye `assets/books/`).
   - Ukiacha wazi, kitufe kinasema **"Omba kiungo"** na mteja anapata kiungo
     kupitia WhatsApp. Hii ni sawa hata kabla ya kuongeza faili halisi.
5. Hifadhi.

> **Vidokezo:**
> - Vitabu vya PDF vinavyokuwepo sasa (`Haki za Mke na Mume`,
>   `Hatua Tano za Maandalizi ya Ndoa`) ni **nakala za mfano** — zina kichwa
>   tu, sio maudhui kamili. Unapokuwa na PDF halisi, badilisha kupitia
>   jopo la uongozi (weka PDF kwenye `assets/books/` na usasishe kiungo).

### g) Mabango

1. `/admin` → **Mabango (Posters)**.
2. Bofya **"Add"**: pakia **Picha ya Bango** (ukubwa kamili), chagua
   **Thumbnail ya WebP** (hiari), na andika **Maelezo/Kichwa** (mfano:
   "Je, Unajiandaa Kuingia Katika Ndoa?").
3. Hifadhi.

### h) Picha ya Sheikh na takwimu (credentials)

1. `/admin` → **Mipangilio ya Tovuti**.
2. **"Picha ya Sheikh"** — pakia picha halisi ya Sheikh (SVG/WebP/PNG).
   Ukiacha wazi, picha ya mfano inatumika.
3. **"Takwimu za Uaminifu (credentials)"** — hizi ni kadi chini ya picha:
   mfano `15+` → "Miaka ya uzoefu". Unaweza kuongeza au kubadilisha.

---

## 6. Mabadiliko yanaonekana lini?

- Mabadiliko unayohifadhi kwenye `/admin` yanahifadhiwa mara moja kwenye
  mfumo wa tovuti (GitHub).
- Ili yaonekane kwenye tovuti ya wageni, tovuti inahitaji kujengwa upya
  (rebuild). Kwa kawaida hii inatokea kiotomatiki ndani ya dakika 1–2.
- **Ikiwa baada ya muda mabadiliko hayajaonekana:** usihifadhi tena mara
  kwa mara. Wasiliana na mtu wako wa kiufundi ili auunganishe tovuti ya
  Netlify na GitHub (jambo la mara moja tu) — baada ya hapo mabadiliko
  yatachapishwa kiotomatiki.

---

## 7. Vidokezo vya kawaida na maswali

**Nimeweka alama tarehe imejaa, lakini kalenda bado inaonyesha inapatikana.**
Tarehe hiyo inaweza kuwa katika mwezi tofauti — hakikisha umeichagua katika
mwezi sahihi. Kama imekwisha muda, subiri hadi dakika chache, kisha futa
tarehe na uirudishe (Remove → Add) ikiwa bado haijaonekana.

**Nimepakia PDF, lakini haionekani.**
Hakikisha umehifadhi baada ya kupakia, na usisahau kuweka kiungo kwenye
sehemu ya "Faili la PDF au Kiungo cha Audio/Video" (si tu kupakia faili —
kiungo ni tofauti).

**Nimesahau nenosiri la `/admin`.**
Kwenye ukurasa wa kuingia bofya "Forgot password?" — utapata barua pepe ya
kuweka nenosiri jipya.

**Nitajuaje mteja ameweka miadi?**
Mteja anapotuma fomu, ujumbe unafunguka kwenye WhatsApp yako. Pia unaweza
kupokea miadi moja kwa moja kupitia simu au WhatsApp.

**Nimefanya makosa. Je, ninaweza kuiharibu tovuti?**
La. Unaweza kufungua kipengele kile kile na kukibadilisha tena wakati
wowote. Kila mabadiliko yanahifadhiwa tofauti, na tovuti hujengwa upya
kutoka kwenye mabadiliko yaliyokubaliwa.

---

## 8. Usalama (hatua chache)

- Kuingia `/admin` kunawezekana kwa wale waliopata **mwaliko** tu. Usimwalike
  mtu yeyote usiyemwamini (kupitia Netlify → Identity → Invite users).
- Weka nenosiri imara.
- Ukiona kitu kikitu, usijaribu kubadilisha mfumo — wasiliana na mtu wako
  wa kiufundi.

---

*Kwa usaidizi wa kiufundi (kuunganisha Netlify na GitHub, kubadilisha namba
ya WhatsApp, kuongeza ukurasa mpya), wasiliana na mtu wako wa kiufundi au
mdau aliyekujengea tovuti hii.*
