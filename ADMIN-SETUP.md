# Jopo la Uongozi (Admin Panel) — Mwongozo wa Kuwasha

Tovuti hii ina jopo la uongozi (content management panel) katika `/admin`
linalotumia **Decap CMS** — chombo cha bure, kinachofanya kazi moja kwa moja
na GitHub + Netlify, bila hitaji la database ya ziada. Unapohariri kitu
(ushuhuda, rasilimali, mabango, tarehe za miadi, masaa ya kazi), mabadiliko
huhifadhiwa moja kwa moja kwenye faili za JSON ndani ya repo yako ya GitHub,
na Netlify hujenga upya tovuti kiotomatiki.

## Hatua za Kuwasha (mara moja tu)

1. **Weka tovuti kwenye GitHub na uiunganishe na Netlify** (kama ilivyoelezwa
   kwenye hatua za awali za deployment).

2. **Washa Netlify Identity:**
   - Nenda kwenye dashibodi ya Netlify → chagua tovuti yako
   - `Site configuration` → `Identity` → `Enable Identity`
   - Chini ya `Registration preferences`, chagua **Invite only** (ili si kila
     mtu aweze kujisajili kama msimamizi)

3. **Washa Git Gateway:**
   - Bado kwenye `Identity` → nenda chini hadi `Services`
   - Bofya `Enable Git Gateway` (hii inaruhusu Decap CMS kuhifadhi
     mabadiliko moja kwa moja kwenye GitHub repo yako bila wewe kuweka
     token yoyote)

4. **Jialike mwenyewe kama msimamizi:**
   - `Identity` tab → `Invite users` → weka barua pepe yako
   - Utapata email ya mwaliko — fungua kiungo, weka password yako

5. **Ingia kwenye jopo:**
   - Nenda `https://tovuti-yako.netlify.app/admin/`
   - Ingia na email/password uliyoweka
   - Sasa unaweza kuongeza/kuhariri: Ushuhuda, Rasilimali (PDF/Makala/
     Audio/Video), Mabango, Kalenda ya Miadi, na Masaa ya Kazi

## Jinsi Kalenda ya Miadi Inavyofanya Kazi

Kalenda kwenye tovuti (sehemu ya "Chagua Tarehe Inayopatikana") inasoma
tarehe zilizojaa kutoka `content/bookings.json`. Utaratibu ulioshauriwa:

1. Mteja anaweka ombi la miadi kupitia fomu (inatumwa WhatsApp) au kupitia
   simu/WhatsApp moja kwa moja
2. Baada ya kuthibitisha miadi na mteja, wewe (msimamizi) unaingia
   `/admin` → `Kalenda ya Miadi` → unaongeza tarehe husika kwenye orodha
   ya "Tarehe Zilizojaa"
3. Baada ya dakika chache (Netlify inajenga upya tovuti), tarehe hiyo
   itaonekana na alama ya kufuli (🔒) kwenye kalenda ya tovuti

**Kumbuka muhimu:** Kwa sababu hii ni tovuti tuli (static site) bila
database ya papo kwa hapo, kufunga tarehe si automatic — inahitaji hatua
hii fupi ya mwisho kutoka kwako. Hii ni ya kawaida kwa tovuti za biashara
ndogo zinazotumia miundombinu ya bure, na inatoa udhibiti kamili kwako
kuhusu ni tarehe zipi hasa zimejaa.

## Kubadilisha Masaa ya Kazi

`/admin` → `Mipangilio ya Tovuti` → hariri orodha ya masaa, au badilisha
"Siku za Wiki Zilizofungwa" (weekly off days) — hii pia inaathiri moja kwa
moja ni siku gani za wiki hazitaweza kubofywa kwenye kalenda.

## Kuongeza PDF/Audio/Video Halisi

`/admin` → `Rasilimali` → chagua rasilimali → sehemu ya "Faili la PDF au
Kiungo cha Audio/Video" unaweza kupakia faili (huhifadhiwa kwenye
`assets/uploads/`) au kuweka kiungo cha nje (mfano YouTube/SoundCloud
kwa audio/video). Ukiacha wazi, kitufe kitaomba nakala kupitia WhatsApp
badala yake — hii inafanya kazi vizuri hata kabla ya kuongeza faili halisi.

## Usalama

- Watu wanaoalikwa tu kupitia `Identity → Invite users` ndio wanaoweza
  kuingia `/admin`. Usimwalike mtu yeyote usiyemwamini.
- `/admin` haijaorodheshwa kwenye injini za utafutaji (imewekwa
  `noindex, nofollow`), lakini bado ni vizuri password iwe imara.
