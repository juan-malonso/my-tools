import { type Monitor } from '@/models';

export const PIXELS_PER_INCH = 15; // Factor de escala (1 pulgada = 15 píxeles)

export function calculateMonitorDimensions(
  monitor: Pick<Monitor, 'aspectRatio' | 'inches' | 'orientation' | 'position'>
) {
  const { inches, aspectRatio, orientation, position } = monitor;
  const { x, y } = position;

  const [ratioW, ratioH] = (aspectRatio || '16:9').split(':').map(Number);
  const ar = ratioW / ratioH;

  const inchesH = (inches || 0) / Math.sqrt(ar * ar + 1);
  const inchesW = ar * inchesH;

  let cm = { w: inchesW * 2.54, h: inchesH * 2.54 };
  let pixelW = inchesW * PIXELS_PER_INCH;
  let pixelH = inchesH * PIXELS_PER_INCH;

  if (orientation === 'vertical') {
    cm = { w: cm.h, h: cm.w };
    pixelW = inchesH * PIXELS_PER_INCH;
    pixelH = inchesW * PIXELS_PER_INCH;
  }

  return {
    h: Math.round(pixelH),
    w: Math.round(pixelW),
    x,
    y,
    cm
  };
}
