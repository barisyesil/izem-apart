// =====================================================================
// UYGULAMA İKONLARI ÜRETİMİ (favicon.ico + apple-icon.png)
// ---------------------------------------------------------------------
// app/icon.svg (marka amblemi) zaten Next.js'in "icon" dosya kuralıyla
// modern tarayıcılarda otomatik favicon olarak sunuluyor. Ama SADECE SVG
// ikon bırakmak geniş uyumluluk için yeterli değil: Windows'ta sekmeye
// sabitleme/yer imleri, eski tarayıcı sürümleri ve iOS'ta "Ana Ekrana
// Ekle" gibi yerler hâlâ klasik bir favicon.ico ve/veya apple-icon.png
// bekler (bkz. node_modules/next/dist/docs/.../app-icons.md — "six files
// that fit most needs" notu). Bu script, TEK doğruluk kaynağı olan
// app/icon.svg'den bu iki dosyayı üretir; marka amblemi değişirse
// (app/icon.svg düzenlenip) bu script tekrar çalıştırılması yeterlidir.
//
// favicon.ico'nun içine 16/32/48 px PNG gömülüyor (Windows Vista'dan beri
// ICO dosyaları ham BMP yerine PNG içerebiliyor — tüm modern tarayıcılar
// bunu destekliyor) çünkü sharp'ın kendisi .ico YAZAMIYOR; format basit
// olduğu için ekstra bir npm bağımlılığı eklemek yerine ICO konteynerini
// burada elle (ICONDIR + ICONDIRENTRY başlıkları) oluşturuyoruz.
//
// Çalıştırmak için: node scripts/generate-app-icons.mjs
// =====================================================================
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SVG_PATH = fileURLToPath(new URL("../app/icon.svg", import.meta.url));
const FAVICON_PATH = fileURLToPath(new URL("../app/favicon.ico", import.meta.url));
const APPLE_ICON_PATH = fileURLToPath(new URL("../app/apple-icon.png", import.meta.url));

// SVG'nin kendi viewBox'ı 32x32 birim — hedef boyuta göre "density" (DPI)
// ayarlanmazsa sharp/librsvg düşük çözünürlükte rasterize edip sonra
// büyütür (bulanık çıkar). Density'yi hedef px / 32 * 96 yaparak SVG'yi
// DOĞRUDAN hedef çözünürlükte, keskin çiziyoruz.
async function renderPng(svgBuffer, size) {
  const density = Math.round((size / 32) * 96);
  return sharp(svgBuffer, { density })
    .resize(size, size)
    .png()
    .toBuffer();
}

// Basit bir ICO konteyneri: ICONDIR (6 bayt) + her görsel için bir
// ICONDIRENTRY (16 bayt) + ham PNG verileri, sırayla arka arkaya.
function buildIco(entries) {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  let offset = HEADER_SIZE + ENTRY_SIZE * entries.length;

  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(entries.length, 4);

  const dirEntries = [];
  for (const { size, data } of entries) {
    const entry = Buffer.alloc(ENTRY_SIZE);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256px)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256px)
    entry.writeUInt8(0, 2); // palet rengi yok (true color)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (RGBA)
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...entries.map((e) => e.data)]);
}

async function main() {
  const svgBuffer = await readFile(SVG_PATH);

  const icoSizes = [16, 32, 48];
  const icoEntries = [];
  for (const size of icoSizes) {
    icoEntries.push({ size, data: await renderPng(svgBuffer, size) });
  }
  await writeFile(FAVICON_PATH, buildIco(icoEntries));
  console.log(`favicon.ico yazıldı (${icoSizes.join("/")} px, PNG gömülü).`);

  const appleIcon = await renderPng(svgBuffer, 180);
  await writeFile(APPLE_ICON_PATH, appleIcon);
  console.log("apple-icon.png yazıldı (180x180).");
}

main();
