// =====================================================================
// GÖRSEL OPTİMİZASYON HATTI
// ---------------------------------------------------------------------
// public/images/ içindeki kaynak fotoğrafları (jpg/png) yayına uygun
// WebP kopyalara dönüştürür ve her biri için minik bir "blur" ön izleme
// (base64) üretir. Çıktılar:
//   - public/images/<ad>.webp            (yeniden boyutlanmış, sıkıştırılmış)
//   - lib/image-manifest.ts              (boyutlar + blurDataURL kaydı)
//
// Neden build'e değil de ayrı bir script'e koyduk: site statik export
// dâhil HER hostta çalışabilsin diye görseller sunucuda değil, geliştirme
// makinesinde bir kez optimize edilir ve depoya öyle girer.
// Çalıştırmak için:  npm run optimize-images
// Yeni fotoğraf eklerseniz bu komutu bir kez daha çalıştırmanız yeterli.
// =====================================================================
import { readdir, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGES_DIR = fileURLToPath(new URL("../public/images/", import.meta.url));
const MANIFEST_PATH = fileURLToPath(new URL("../lib/image-manifest.ts", import.meta.url));

// Logo şeffaf PNG (Header'da filtreyle renklendiriliyor) — dokunmuyoruz.
const SKIP = new Set(["logo.png"]);

// Sayfadaki en büyük kullanım genişliklerine göre hedef genişlikler.
// Hero tam ekran arka plan olduğu için daha geniş tutulur.
const widthFor = (name) => (name.startsWith("hero") ? 1920 : 1400);

const files = (await readdir(IMAGES_DIR)).filter(
  (f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f),
);

const manifest = {};

for (const file of files) {
  const { name } = parse(file);
  const srcPath = join(IMAGES_DIR, file);
  const outName = `${name}.webp`;
  const outPath = join(IMAGES_DIR, outName);

  const pipeline = sharp(srcPath).rotate(); // EXIF yönünü düzelt
  const meta = await pipeline.metadata();
  const targetWidth = Math.min(widthFor(name), meta.width ?? Infinity);

  const { width, height } = await pipeline
    .clone()
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(outPath);

  // 12px genişliğinde minik bir kopya → base64 blur ön izleme.
  const blurBuffer = await pipeline
    .clone()
    .resize({ width: 12 })
    .webp({ quality: 40 })
    .toBuffer();

  manifest[`/images/${outName}`] = {
    width,
    height,
    blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
  };

  const savedKb = Math.round((meta.size ?? 0) / 1024);
  console.log(`✓ ${file} → ${outName} (${width}×${height}${savedKb ? `, kaynak ${savedKb}KB` : ""})`);
}

const banner = `// =====================================================================
// OTOMATİK ÜRETİLEN DOSYA — ELLE DÜZENLEMEYİN
// scripts/optimize-images.mjs tarafından üretilir (npm run optimize-images).
// Her optimize görselin boyutları ve yüklenirken gösterilen bulanık
// ön izlemesi (blurDataURL) burada tutulur; Figure.tsx bunları okur.
// =====================================================================
export const imageMeta: Record<
  string,
  { width: number; height: number; blurDataURL: string }
> = `;

await writeFile(MANIFEST_PATH, banner + JSON.stringify(manifest, null, 2) + ";\n");
console.log(`\n${files.length} görsel işlendi → lib/image-manifest.ts güncellendi.`);
