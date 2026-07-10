"use client";

import dynamic from "next/dynamic";

// Lightbox, yalnızca bir fotoğrafa tıklanınca gerçekten kullanılan bir
// modal. Ama Gallery.tsx ve Rooms.tsx onu statik import ediyordu — bu da
// Lightbox'ın (ve onun Figure/ikon bağımlılıklarının) ilk JS paketinde
// taşınması demekti (PSI: "Kullanılmayan JavaScript'i azaltın"). next/dynamic
// ile bu kod ayrı bir parçaya (chunk) alınır ve yalnızca ilk açılışta indirilir.
//
// TEK bir paylaşılan "lazy" sarmalayıcı olarak burada tanımlanıp hem Gallery
// hem Rooms'ta import edilmesinin sebebi: ikisi de AYNI chunk referansına
// çözülsün diye — hangisi önce açılırsa açılsın, parça bir kez indirilip
// önbelleğe alınır. ssr:false: modal ilk sunucu render'ında hiç gerekmiyor.
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

export default Lightbox;
