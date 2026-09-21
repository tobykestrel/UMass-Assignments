import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const newImage = img.copy();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      newImage.setPixel(i,j, func(img, i, j));
    }
  }
  return newImage;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => {
    const p = img.getPixel(x,y);
    if (cond(img, x, y)) { return func(p); }
    else return p;
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapIf(
    img, 
    (img, x, y) => (
      x <= xInterval[1] && 
      x >= xInterval[0] && 
      y <= yInterval[1] && 
      y >= yInterval[0]), 
    func
  );
}

export function isGrayish(p: Color): boolean {
  // TODO
  const maxChannelValue = Math.max(p[0], p[1], p[2]);
  const minChannelValue = Math.min(p[0], p[1], p[2]);
  return ((maxChannelValue-minChannelValue) <= 85);
}

export function makeGrayish(img: Image): Image {
  // TODO
  return imageMapIf(
    img, 
    (img, x, y) => !isGrayish(img.getPixel(x,y)), 
    (p) => {
      const avgChannelValue = Math.trunc((p[0] + p[1] + p[2])/3);
      return [avgChannelValue, avgChannelValue, avgChannelValue];
    }
  );
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  return [
    pxBlurAvg(img,x,y,0), 
    pxBlurAvg(img,x,y,1), 
    pxBlurAvg(img,x,y,2)
  ];
}

export function pxBlurAvg(img: Image, x: number, y: number, chnl: number): number {
  let pixelBlurTotal = 0;
  let pixelsCount = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x+i < img.width && x+i >= 0 && y+j < img.height && y+j >= 0) {
        pixelBlurTotal += img.getPixel(x+i,y+j)[chnl];
        pixelsCount++;
      }
    }
  }
  return Math.trunc((pixelBlurTotal/pixelsCount));
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(
    img, 
    (img, x, y) => pixelBlur(img, x, y)
  );
}