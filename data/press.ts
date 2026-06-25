
export interface PressImage {
  id: string;
  src: string;
}

export const pressImages: PressImage[] = Array.from({ length: 19 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { id: `basin-${n}`, src: `/images/press/basin-${n}.jpg` };
});
