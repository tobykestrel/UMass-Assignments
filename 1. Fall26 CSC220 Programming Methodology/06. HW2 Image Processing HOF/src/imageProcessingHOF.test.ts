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
  imageBlur
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

function createGridImage(
  w = 10, 
  h = 10, 
  c1: Color = COLORS.WHITE, 
  c2: Color = COLORS.BLACK): 
Image {
  const checkerPatternedImg = Image.create(w, h, c1);
  for (let i = 0; i < w; i += 2) for (let j = 0; j < h; j += 2) {
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
    const output = imageMapCoord(input, (img, x, y) => [x,y,x+y]);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expectColorToBeCloseTo(output.getPixel(i,j), [i, j, i+j]);
      }
    }
  });

  // More tests for imageMapCoord go here.
});

describe("imageMapIf", () => {

  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapIf(input, ()=>true, identityP);
    assert(input !== output);
  });

  it("should change pixels where the condition is true", () => {
    const input = createGridImage(3,3);
    const output = imageMapIf(
      input,
      (img, x, y) => img.getPixel(x,y) == COLORS.BLACK,
      p => COLORS.RED
    );
    for (let i = 0; i < 3; i+=2) {
      for (let j = 0; j < 3; j+=2) {
        expectColorToBeCloseTo(output.getPixel(i,j), COLORS.RED);
      }
    }
  });

  // More tests for imageMapIf go here
});

describe("mapWindow", () => {

  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = mapWindow(input, [0,1],[0,1], identityP);
    assert(input !== output);
  });

  it("should transform everything in the inclusive window", () => {
    const input = Image.create(4, 4, [10, 20, 30]);

    const output = mapWindow(
      input,
      [1, 2],
      [1, 2],
      p => [p[0] + 10, p[1] + 10, p[2] + 10]
    );

    expectColorToBeCloseTo(output.getPixel(1, 1), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(2, 1), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(1, 2), [20, 30, 40]);
    expectColorToBeCloseTo(output.getPixel(2, 2), [20, 30, 40]);

    expectColorToBeCloseTo(output.getPixel(0, 0), [10, 20, 30]);
    expectColorToBeCloseTo(output.getPixel(3, 3), [10, 20, 30]);
  });

  // More tests for mapWindow go here
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
});

describe("makeGrayish", () => {

  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = makeGrayish(input);
    assert(input !== output);
  });
  
  // More tests for makeGrayish go here
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
});

describe("pxBlurAvg", () => {
  // Tests for pxBlurAvg go here
});

describe("imageBlur", () => {

  it("should return a different image in memory", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageBlur(input);
    assert(input !== output);
  });

  // Tests for imageBlur go here
});