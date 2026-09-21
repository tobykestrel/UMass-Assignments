import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  pxBlurAvg,
  imageBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

function identity(img: Image, x: number, y: number) {
  return img.getPixel(x, y);
}

function identityP(c: Color) {
  return [c[0], c[1], c[2]];
}

function createGridImage(w = 10, h = 10, c1: Color = COLORS.WHITE, c2: Color = COLORS.BLACK): Image {
  const checkerPatternedImg = Image.create(w, h, c1);
  for (let i = 0; i < w; i += 2)
    for (let j = 0; j < h; j += 2) {
      checkerPatternedImg.setPixel(i, j, c2);
    }
  return checkerPatternedImg;
}

describe("imageMapCoord", () => {
  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  it("should apply the function to every pixel", () => {
    const input = Image.create(3, 3, COLORS.BLACK);
    const output = imageMapCoord(input, (img, x, y) => [x, y, x + y]);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expectColorToBeCloseTo(output.getPixel(i, j), [i, j, i + j]);
      }
    }
  });

  // More tests for imageMapCoord go here.
});

describe("imageMapIf", () => {
  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapIf(input, () => true, identityP);
    assert(input !== output);
  });

  it("should change pixels where the condition is true", () => {
    const input = createGridImage(3, 3);
    const output = imageMapIf(
      input,
      (img, x, y) => {
        const p = img.getPixel(x, y);
        return p[0] == 0 && p[1] == 0 && p[2] == 0;
      },
      () => COLORS.RED
    );
    for (let i = 0; i < 3; i += 2) {
      for (let j = 0; j < 3; j += 2) {
        expectColorToBeCloseTo(output.getPixel(i, j), COLORS.RED);
      }
    }
  });

  // More tests for imageMapIf go here
});

describe("mapWindow", () => {
  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = mapWindow(input, [0, 1], [0, 1], identityP);
    assert(input !== output);
  });

  it("should transform everything in the inclusive window", () => {
    const input = Image.create(4, 4, [10, 20, 30]);
    const output = mapWindow(input, [1, 2], [1, 2], p => [p[0] + 10, p[1] + 10, p[2] + 10]);
    expectColorToBeCloseTo(output.getPixel(1, 1), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(2, 1), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(1, 2), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(2, 2), [20, 30, 40]);
  });

  it("shouldn't transform anything outside the inclusive window", () => {
    const input = Image.create(4, 4, [10, 20, 30]);
    const output = mapWindow(input, [1, 2], [1, 2], p => [p[0] + 10, p[1] + 10, p[2] + 10]);
    expectColorToBeCloseTo(output.getPixel(0, 0), [10, 20, 30]);
    expectColorToBeCloseTo(output.getPixel(0, 3), [10, 20, 30]);
    expectColorToBeCloseTo(output.getPixel(3, 0), [10, 20, 30]);
    expectColorToBeCloseTo(output.getPixel(3, 3), [10, 20, 30]);
  });

  it("should return a copy of the image if a window's min is greater than its max", () => {
    const input = Image.create(4, 4, [1, 2, 3]);
    const output1 = mapWindow(input, [2, 1], [1, 2], p => [67, p[1] + 67, 67]);
    const output2 = mapWindow(input, [1, 2], [2, 1], p => [67, p[1] + 67, 67]);
    expectColorToBeCloseTo(output1.getPixel(0, 0), [1, 2, 3]);
    expectColorToBeCloseTo(output2.getPixel(0, 0), [1, 2, 3]);
  });

  it("should return a copy of the image if a window is out of bounds", () => {
    const input = Image.create(4, 4, [1, 2, 3]);
    const output1 = mapWindow(input, [5, 6], [1, 2], p => [67, p[1] + 67, 67]);
    const output2 = mapWindow(input, [1, 2], [5, 6], p => [67, p[1] + 67, 67]);
    expectColorToBeCloseTo(output1.getPixel(0, 0), [1, 2, 3]);
    expectColorToBeCloseTo(output2.getPixel(0, 0), [1, 2, 3]);
    const output3 = mapWindow(input, [-1, 0], [1, 2], p => [67, p[1] + 67, 67]);
    const output4 = mapWindow(input, [1, 2], [-67, 67], p => [67, p[1] + 67, 67]);
    expectColorToBeCloseTo(output3.getPixel(0, 0), [1, 2, 3]);
    expectColorToBeCloseTo(output4.getPixel(0, 0), [1, 2, 3]);
  });

  // More tests for mapWindow go here
});

describe("isGrayish", () => {
  it("should say no if the max/min difference is more than 85", () => {
    expect(isGrayish([0, 0, 86])).toBe(false);
    expect(isGrayish([0, 86, 0])).toBe(false);
    expect(isGrayish([86, 0, 0])).toBe(false);
  });

  it("should say yes if the max/min difference is 85 or less", () => {
    expect(isGrayish([100, 100, 100])).toBe(true);
    expect(isGrayish([0, 0, 85])).toBe(true);
    expect(isGrayish([0, 85, 0])).toBe(true);
    expect(isGrayish([85, 0, 0])).toBe(true);
    expect(isGrayish([0, 0, 0])).toBe(true);
  });

  it("should be gray regardless of channel order", () => {
    expect(isGrayish([10, 50, 30])).toBe(true);
    expect(isGrayish([30, 50, 10])).toBe(true);
  });
  // More tests for isGrayish go here
});

describe("makeGrayish", () => {
  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = makeGrayish(input);
    assert(input !== output);
  });

  it("should leave grayish pixels unchanged", () => {
    const input = Image.create(3, 3, [0, 86, 0]);
    input.setPixel(1, 1, [0, 85, 0]);
    const output = makeGrayish(input);
    expectColorToBeCloseTo(output.getPixel(1, 1), [0, 85, 0]);
  });

  it("should average out non-grayish pixels", () => {
    const input = Image.create(3, 3, [0, 85, 0]);
    input.setPixel(1, 1, [0, 90, 0]);
    const output = makeGrayish(input);
    expectColorToBeCloseTo(output.getPixel(1, 1), [30, 30, 30]);
  });
  // More tests for makeGrayish go here
});

describe("pixelBlur", () => {
  it("blurs the center pixel using the 3x3 average for each channel", () => {
    const input = Image.create(3, 3, [0, 0, 0]);
    input.setPixel(1, 1, [90, 9, 45]);
    const output = pixelBlur(input, 1, 1);
    expectColorToBeCloseTo(output, [10, 1, 5]);
  });

  it("ignores pixels outside the image when blurring a corner", () => {
    const input = Image.create(3, 3, [0, 0, 0]);
    input.setPixel(0, 0, [6, 67, 7]);
    input.setPixel(1, 0, [6, 67, 7]);
    input.setPixel(0, 1, [6, 67, 7]);
    input.setPixel(1, 1, [6, 67, 7]);
    const out = pixelBlur(input, 0, 0);
    expectColorToBeCloseTo(out, [6, 67, 7]);
  });

  // More tests for pixelBlur go here
});

describe("pxBlurAvg", () => {
  it("computes the average for a single channel over the valid neighbors", () => {
    const img = Image.create(3, 3, [10, 10, 10]);
    img.setPixel(0, 0, [0, 50, 1]);
    img.setPixel(1, 0, [20, 100, 2]);
    img.setPixel(0, 1, [40, 110, 3]);
    img.setPixel(1, 1, [60, 140, 2]);
    expect(pxBlurAvg(img, 0, 0, 0)).toBe(30); // (0+20+40+60)/4 = 30
    expect(pxBlurAvg(img, 0, 0, 1)).toBe(100); // (50+100+110+140)/4 = 100
    expect(pxBlurAvg(img, 0, 0, 2)).toBe(2); // (1+2+3+2)/4 = 2
  });

  // More tests for pxBlurAvg go here
});

describe("imageBlur", () => {
  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageBlur(input);
    assert(input !== output);
  });

  it("blurs the whole image", () => {
    const input = Image.create(3, 3, [255, 0, 0]);
    input.setPixel(1, 1, [0, 255, 0]);
    const output = imageBlur(input);
    expect(output.getPixel(1, 1)).not.toEqual([0, 255, 0]);
    expect(output.getPixel(0, 0)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(0, 1)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(0, 2)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(1, 0)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(1, 2)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(2, 0)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(2, 1)).not.toEqual([255, 0, 0]);
    expect(output.getPixel(2, 2)).not.toEqual([255, 0, 0]);
  });

  // More tests for imageBlur go here
});
