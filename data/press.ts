// Basın ve Medya — Doç. Dr. Ahmet Ali Süzen'in basında/medyada yer aldığı görseller.
//
// FOTOĞRAFLAR: public/images/press/ klasörüne aşağıdaki adlarla atılır:
//   basin-01.jpg, basin-02.jpg, ... , basin-19.jpg
// (Görseller ekran görüntüsü olduğu için galeride tam/kırpılmadan gösterilir.)

export interface PressImage {
  id: string;
  /** Görsel yolu — public/images/press/ altındaki dosya */
  src: string;
}

// 19 görsel için otomatik liste üretilir: /images/press/basin-01.jpg ...
export const pressImages: PressImage[] = Array.from({ length: 19 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { id: `basin-${n}`, src: `/images/press/basin-${n}.jpg` };
});
