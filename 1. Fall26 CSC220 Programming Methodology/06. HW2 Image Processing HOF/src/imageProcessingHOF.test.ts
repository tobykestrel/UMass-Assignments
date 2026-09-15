import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  imageBlur
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  // More tests for imageMapCoord go here.
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
});