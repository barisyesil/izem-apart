# İzem Apart Web Sitesi — Başlangıç Rehberi

Bu rehber, çalıştırabilmesi,
metinleri/fotoğrafları değiştirebilmesi ve sürecin nasıl işlediğini öğrenmesi
için yazılmıştır. Acele etmeyin; adım adım gidin.

---

## 1. Bu proje nedir?

Eskişehir'deki **İzem Bayan Apart** için yapılmış, tek sayfalık tanıtım web
sitesidir. Eski sitenin yaptığı her şeyi yapar; sadece çok daha şık ve modern
görünür. Telefondan girenler için (öğrenciler genelde telefon kullanır) özel
olarak optimize edilmiştir.

Önemli: Bu bir **"ön yüz" (frontend)** projesidir. Yani veritabanı, üyelik,
online rezervasyon **yoktur**. İletişim formu, doldurulunca doğrudan
**WhatsApp** veya **e-posta** uygulamasını açar.

---

## 2. Web sitesi nasıl çalışır? (çok kısa fikir)

- Site **Next.js** adlı bir araçla yapıldı (React tabanlı).
- Sayfa, **"bölüm" (component)** denilen parçalardan oluşur: Karşılama, Hakkımızda,
  Odalar, Olanaklar, Konum, Galeri, İletişim.
- Sitedeki **tüm yazılar ve bilgiler tek bir dosyada** toplanmıştır:
  `lib/content.ts`. Bir şeyi değiştirmek istediğinizde önce oraya bakın.

---

## 3. Gerekli programları kurun

Sırasıyla şunları kurun (hepsi ücretsiz):

1. **Node.js** — projeyi çalıştıran motor.
   - <https://nodejs.org> adresine gidin, **LTS** sürümünü indirip kurun.
   - Kurulum bitince kontrol için (bkz. Terminal nedir?) `node --version` yazın;
     bir sürüm numarası görmelisiniz.
2. **Visual Studio Code (VS Code)** — kod yazma/düzenleme programı.
   - <https://code.visualstudio.com> adresinden indirip kurun.
3. **Git** — kodun sürümlerini saklayan araç.
   - <https://git-scm.com> adresinden indirip kurun.

> **Terminal nedir?** İçine komut yazdığımız siyah/metin tabanlı pencere.
> VS Code'da üstteki menüden **Terminal → New Terminal** ile açabilirsiniz.

---

## 4. Projeyi açın ve çalıştırın

1. VS Code'u açın → **File → Open Folder** → `izem-apart` klasörünü seçin.
2. **Terminal → New Terminal** ile terminali açın.
3. Sırasıyla şu komutları yazın (her birinden sonra Enter):

```bash
npm install      # gerekli paketleri indirir (ilk seferde birkaç dakika sürer)
npm run dev      # siteyi başlatır
```

4. Terminalde `http://localhost:3000` yazısını görünce, tarayıcınızda bu adresi
   açın. Siteyi canlı görürsünüz. 🎉
5. Bir dosyayı kaydettiğinizde site **otomatik yenilenir** — değişikliği anında
   görürsünüz.
6. Durdurmak için terminalde **Ctrl + C** tuşlayın.

---

## 5. Klasör yapısı (ne nerede?)

```
izem-apart/
├─ app/
│  ├─ layout.tsx     → Sitenin iskeleti: fontlar, başlık etiketi, Header + Footer
│  ├─ page.tsx       → Ana sayfa: bölümleri sırayla dizer
│  └─ globals.css    → RENKLER ve FONTLAR burada tanımlı
├─ components/
│  ├─ layout/        → Header (üst menü) ve Footer (alt bilgi)
│  ├─ sections/      → Her bölüm ayrı dosya (Hero, About, Rooms, Amenities, ...)
│  └─ ui/            → Tekrar kullanılan küçük parçalar (buton, kapsayıcı, vb.)
├─ lib/
│  ├─ content.ts     → ⭐ SİTEDEKİ TÜM YAZILAR VE BİLGİLER (en çok burayı düzenlersiniz)
│  └─ types.ts       → İçeriğin "tipleri" (dokunmanıza gerek yok)
├─ public/           → Fotoğraflar buraya konur
└─ docs/REHBER.md    → Bu rehber
```

Kodun içindeki **yorum satırları Türkçedir**; her dosyanın ne yaptığını
açıklarlar.

---

## 6. ⭐ Metinleri değiştirme (en sık yapacağınız iş)

Neredeyse her yazı `lib/content.ts` dosyasındadır. VS Code'da bu dosyayı açın.

**Örnek 1 — Telefon numarasını değiştirmek:**

```ts
export const site = {
  phone: "0222 700 00 61",        // ← buradaki numarayı değiştirin
  phoneHref: "tel:+902227000061", // ← tıklanınca aranan numara (başında +90)
  ...
};
```

**Örnek 2 — Bir oda açıklamasını değiştirmek:**

```ts
{
  name: "Tek Kişilik Oda",
  capacity: "1 kişilik",
  description: "Kendinize ait, sakin ve güvenli bir çalışma...", // ← bu yazıyı değiştirin
  features: [
    "Tek kişilik kullanım",   // ← maddeleri ekleyip çıkarabilirsiniz
    "Odaya özel banyo ve WC",
  ],
}
```

**Kurallar (önemli):**

- Yazılar **tırnak içindedir** `"..."`. Sadece tırnakların **içini** değiştirin.
- Satır sonundaki **virgülleri silmeyin**.
- Türkçe karakterler (ş, ğ, ı, İ, ç, ö, ü) sorunsuz çalışır.
- Kaydedin (**Ctrl + S**) ve tarayıcıda değişikliği görün.

---

## 7. Fotoğraf ekleme / değiştirme

Sitede gösterilen fotoğraflar `public/images/` klasöründe, **sıkıştırılmış
`.webp` formatında** durur (örn. `tek-kisilik-odalar_1.webp`). Ham/orijinal
fotoğraflar (telefondan çıkan `.jpg`/`.png`) ise `image-sources/` klasöründe
tutulur — bu klasör depoya (git'e) hiç gitmez, sadece sizin bilgisayarınızda
durur. Boş bırakılan (`src: ""`) alanlar şık bir yer tutucuyla gösterilir.

Yeni bir fotoğraf eklemek veya değiştirmek için:

1. Ham fotoğrafı `image-sources/` klasörüne koyun (klasör yoksa oluşturun).
2. Terminalde şu komutu çalıştırın:

   ```
   npm run optimize-images
   ```

   Bu komut `image-sources/` içindeki HER fotoğrafı küçük, hızlı yüklenen
   bir `.webp` kopyasına çevirip `public/images/` klasörüne yazar (aynı
   dosya adıyla, sadece uzantısı `.webp` olur).
3. `lib/content.ts` içinde ilgili alanı, oluşan `.webp` yoluyla doldurun:

```ts
{
  name: "Tek Kişilik Oda",
  image: "/images/oda-tek.webp",   // ← kapak fotoğrafı ("/" ile başlayan yol, .webp)
  imageAlt: "İzem Apart tek kişilik oda",  // ← görseli göremeyenler için açıklama
  gallery: [                       // ← bu odaya tıklayınca açılacak TÜM fotoğraflar
    { src: "/images/oda-tek.webp", alt: "Tek kişilik oda — görünüm 1" },
    { src: "/images/oda-tek-2.webp", alt: "Tek kişilik oda — görünüm 2" },
  ],
}
```

> Odaların kapak fotoğrafına tıklandığında SADECE `gallery` listesindeki
> fotoğraflar açılır. En alttaki "Galeri" bölümü ise `gallery.images`
> (bkz. `lib/content.ts` içinde `export const gallery`) listesindeki TÜM
> fotoğrafları sürekli kayan bir şerit olarak gösterir — yeni bir fotoğrafı
> oraya eklemek için o listeye bir satır eklemeniz yeterli.

> İpucu: Dosya adlarında **Türkçe karakter ve boşluk kullanmayın**
> (`oda-tek.jpg` iyi, `Oda Tek.jpg` kötü) — bu kural `image-sources/`'a
> koyduğunuz ham dosya için geçerli, `npm run optimize-images` boyut
> küçültmeyi zaten sizin için yapar.

---

## 8. Renk ve font değiştirme

Renkler ve fontlar `app/globals.css` dosyasındaki `@theme` bloğundadır:

```css
@theme {
  --color-cream: #f6f1e8;   /* ana zemin rengi */
  --color-sage: #6e7a63;    /* yeşil aksan */
  --color-terracotta: #b16a4c; /* turuncu/kiremit aksan */
  ...
}
```

Bir rengin yanındaki `#xxxxxx` kodunu değiştirip kaydedin; site tüm bölümlerde
o rengi kullanır. (Renk kodu seçmek için: Google'da "renk seçici / color picker".)

---

## 9. Bölümler kısaca nasıl çalışır?

`app/page.tsx` dosyası bölümleri **sırayla** dizer:

```tsx
<Hero />       {/* Karşılama (en üstteki büyük ekran) */}
<About />      {/* Hakkımızda */}
<Trust />      {/* Güven & Konfor */}
<Rooms />      {/* Odalarımız */}
<Amenities />  {/* Olanaklar */}
<Location />   {/* Konum + harita */}
<Gallery />    {/* Galeri */}
<Contact />    {/* İletişim + form */}
```

Bir bölümün sırasını değiştirmek isterseniz bu satırların yerini değiştirin.
Her bölümün kodu `components/sections/` içinde aynı adlı dosyadadır.

---

## 10. Yayına hazırlık (derleme)

Siteyi yayınlamadan önce "derleyip" hatasız olduğunu kontrol etmek için:

```bash
npm run build    # üretim için derler ve hata var mı kontrol eder
```

Hata yoksa `npm run start` ile derlenmiş hâlini açabilirsiniz. (Sitenin nereye/
nasıl yükleneceğine — hosting — sonra birlikte karar verilecek.)

---

## 11. Sık yapılan işler — hızlı liste

| Yapmak istediğiniz | Nereye bakın |
|---|---|
| Telefon / e-posta / adres değiştir | `lib/content.ts` → `site` |
| Menü adlarını değiştir | `lib/content.ts` → `navLinks` |
| Karşılama başlığını değiştir | `lib/content.ts` → `hero` |
| Oda bilgisi düzenle | `lib/content.ts` → `rooms` |
| Olanak ekle/çıkar | `lib/content.ts` → `amenities` |
| Sosyal medya bağlantısı | `lib/content.ts` → `socials` |
| Fotoğraf ekle | `public/` + ilgili `image`/`src` alanı |
| Renkleri değiştir | `app/globals.css` |

---

## 12. Küçük sözlük

- **Next.js / React:** Modern web siteleri yapmak için kullanılan araçlar.
- **Component (bileşen):** Sayfanın yeniden kullanılabilir bir parçası
  (örn. bir buton, bir bölüm).
- **Tailwind CSS:** `className="..."` içine yazılan kısa kelimelerle
  (örn. `text-center`) sayfayı biçimlendirme yöntemi.
- **Terminal:** Komut yazdığımız metin penceresi.
- **npm:** Paketleri (hazır kod parçalarını) indiren/komutları çalıştıran araç.
- **localhost:3000:** Sitenin sizin bilgisayarınızdaki test adresi.
- **Commit:** Yapılan değişikliğin Git'e kaydedilmiş bir anı.

---

## 13. Takılırsanız

- Site açılmıyorsa: terminalde **Ctrl + C** ile durdurup tekrar `npm run dev`.
- `npm install` hata verirse: Node.js kurulu mu kontrol edin (`node --version`).
- Bir şeyi bozduğunuzu düşünüyorsanız: kaydetmeden geri alın (**Ctrl + Z**),
  ya da en yakın `git` yedeğine dönülebilir.
- Emin değilseniz, değiştirdiğiniz dosyanın bir kopyasını alın, sonra deneyin.

Bu yapıyı anladığınızda, benzer bir siteyi sıfırdan kurmanın
mantığını da kavramış olacaksınız.
