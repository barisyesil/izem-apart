// =====================================================================
// OTOMATİK ÜRETİLEN DOSYA — ELLE DÜZENLEMEYİN
// scripts/optimize-images.mjs tarafından üretilir (npm run optimize-images).
// Her optimize görselin boyutları ve yüklenirken gösterilen bulanık
// ön izlemesi (blurDataURL) burada tutulur; Figure.tsx bunları okur.
// =====================================================================
export const imageMeta: Record<
  string,
  { width: number; height: number; blurDataURL: string }
> = {
  "/images/apart-hakkimizda.webp": {
    "width": 989,
    "height": 1080,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoMAA0AA4BaJagCdADMiqMKjAAA/uI5JJShbEPEG7yHb69Dz5QZQ2vgNthqNOvcj0scDiu8ebBUBnawvlwAhnerQG5/5OwBBNcKhEAA"
  },
  "/images/bina-girisi-1.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoMAAkAA4BaJbACdAD8LH4CD2BQAP6BSHE1feUeiG1U72wdD2dgHVpldJk8MoRz5U8JzOb0u0T1TUAA"
  },
  "/images/bina-girisi-2.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAQCdASoMAAkAA4BaJZgCdADcVA3kAAD94nijFw9+Ge4de4t1uDhqQWIq8LPDbfAnPojGEM9CwIl6/bpdJOM8ehxPltZHJpn+e4qBAEaejdJjnyGAAA=="
  },
  "/images/cift-kisilik-odalar_1.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACQAQCdASoMAAkAA4BaJQBOgBsXLtAA/ltYfClw+BBk1ZM0xaJZoYlvNQkLlVS48YZCNZp0mj4Y7IZrgsNvOYLTnQcRUBUaQAA="
  },
  "/images/cift-kisilik-odalar_2.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoMAAkAA4BaJQBOgMWWwL0UKAAA/lfQnoNAAdeh4aPHr0cqCWV97k/+IyTd0Ee/pSYNZChBZj4ryYHMyALvQAAA"
  },
  "/images/cift-kisilik-odalar_3.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAQCdASoMAAkAA4BaJYwC7ADZVt0AAPkxKO0dP4oOQTwWq0DIidozKu0ASWUP8e/oQf7ncB0aeE9BbmI576QAAAA="
  },
  "/images/cift-kisilik-odalar_4.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoMAAkAA4BaJZQAAlRtTfuoAP7oSp9OHgOndDJSgQBBe1gpmP5+Gk5SO/KR2zvnyEKERR0fgAA="
  },
  "/images/cift-kisilik-odalar_5.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACQAQCdASoMAAkAA4BaJZQCdABMvwAA/lfK0Ra1rwA7681xu2UuhtYaQt12X0HTY8jWc0zEtAAAAA=="
  },
  "/images/hero-arka-plan.webp": {
    "width": 1920,
    "height": 1072,
    "blurDataURL": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAgCdASoMAAcAA4BaJZACdAYrnn1Aq+QYAP48Bck2gC2KwQNbmY2TFqtzeMb9rf10QeKnss2h70hc7VvQUktqrwJ+GNaGUifUAAAA"
  },
  "/images/ortak-alan-1.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACwAQCdASoMAAkAA4BaJbACdADYuTIAAP5aF0r1EyMW5nFnbij05SZConh8+6u+FCohZJcT1XPwsbrt0FFYNmuDBuvRYGBhnOVyKcAA"
  },
  "/images/tek-kisilik-odalar_1.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADwAQCdASoMAAkAA4BaJZACdADdZNQTVRAA/PR5B8oOPWgB/4DwoBHvnCEMoR/vTyvTaWRHso2XyqFc0jrfPGFAF726l3y0EAAAAA=="
  },
  "/images/tek-kisilik-odalar_2.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADwAQCdASoMAAkAA4BaJZQCdADcpCiH48AA/thP8dzL/jj+SqJ4UhwfYrbEa2Lv9RPViIDvVFl+wTygfHJFLzi6odQAAA=="
  },
  "/images/tek-kisilik-odalar_3.webp": {
    "width": 1000,
    "height": 709,
    "blurDataURL": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoMAAgAA4BaJZgCdAD0YaPc3gAA/u5Dah5Ds3tudoxO+RMnd7mLQ7QBVugfp+PrQCmrj1kfamWoQIAA"
  },
  "/images/tek-kisilik-odalar_4.webp": {
    "width": 1000,
    "height": 750,
    "blurDataURL": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAQAgCdASoMAAkAA4BaJYwAAuuWYsrmt9KsAP6yCHhtbqI74q8uaFnW8CE/luhSfx4M9a/4VRZgQd9b4LHImeBpblflOlg4AAA="
  }
};
