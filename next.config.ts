import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Daha yüksek sıkıştırma ve hız için AVIF ve WebP desteği
    formats: ['image/avif', 'image/webp'],
    
    // PageSpeed'in beklediği kalite optimizasyonuna izin veren beyaz liste
    qualities: [60, 75, 100],
    
    // Tarayıcının mobilde gereksiz büyük resim seçmesini engelleyen ara boyutlar
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 600],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;