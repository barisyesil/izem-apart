// =====================================================================
// GÖRSEL OPTİMİZASYON HATTI
// ---------------------------------------------------------------------
// image-sources/ içindeki HAM fotoğrafları (jpg/png — bu klasör git'e
// girmez, bkz. .gitignore) yayına uygun WebP kopyalara dönüştürüp
// public/images/'a yazar; her biri için minik bir "blur" ön izleme
// (base64) da üretir. Çıktılar:
//   - public/images/<ad>.webp            (yeniden boyutlanmış, sıkıştırılmış — yayına giden budur)
//   - lib/image-manifest.ts              (boyutlar + blurDataURL kaydı)
//
// Neden kaynak (image-sources/) ve çıktı (public/images/) AYRI klasörde:
// public/images/ sitenin YAYINA GİDEN kısmı; ham, henüz sıkıştırılmamış
// orijinalleri orada tutmanın deploy boyutuna hiçbir faydası yok, sadece
// depoyu (ve barındırdığınız yeri) şişirir. Ham dosyaları ayrı, git'e
// girmeyen bir klasörde tutmak hem public/'ı yalın tutar hem de ileride
// farklı bir kırpma/kalite gerekirse orijinal kaliteyi elde tutar.
//
// Neden build'e değil de ayrı bir script'e koyduk: site statik export
// dâhil HER hostta çalışabilsin diye görseller sunucuda değil, geliştirme
// makinesinde bir kez optimize edilir ve depoya (sadece .webp olarak) girer.
// Çalıştırmak için:  npm run optimize-images
// Yeni fotoğraf eklerseniz: ham dosyayı image-sources/'a koyup bu komutu
// bir kez daha çalıştırmanız yeterli.
// =====================================================================
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE_DIR = fileURLToPath(new URL("../image-sources/", import.meta.url));
const OUTPUT_DIR = fileURLToPath(new URL("../public/images/", import.meta.url));
const MANIFEST_PATH = fileURLToPath(new URL("../lib/image-manifest.ts", import.meta.url));

// Sayfadaki en büyük kullanım genişliklerine göre hedef genişlikler.
// Hero tam ekran arka plan olduğu için daha geniş tutulur.
const widthFor = (name) => (name.startsWith("hero") ? 1920 : 1400);

let files;
try {
  files = (await readdir(SOURCE_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
} catch (err) {
  if (err.code === "ENOENT") {
    console.error(
      `\nHam fotoğraf klasörü bulunamadı: ${SOURCE_DIR}\n` +
        "Önce bu klasörü oluşturup ham (orijinal) fotoğrafları içine koyun, sonra bu komutu tekrar çalıştırın.\n",
    );
    process.exit(1);
  }
  throw err;
}

if (files.length === 0) {
  console.log(`image-sources/ içinde işlenecek jpg/png bulunamadı (${SOURCE_DIR}).`);
  process.exit(0);
}

await mkdir(OUTPUT_DIR, { recursive: true });

const manifest = {};

for (const file of files) {
  const { name } = parse(file);
  const srcPath = join(SOURCE_DIR, file);
  const outName = `${name}.webp`;
  const outPath = join(OUTPUT_DIR, outName);

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
