import assert from "assert";
import { COLORS, Color, Image } from "../include/image.js";
import { saturateGreen, flipColors, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(15, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 0]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(15, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(7, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for saturateGreen go here.
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(15, 15, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  it("should correctly flip the center", () => {
    const whiteImage = Image.create(15, 15, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(7, 7, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(7, 7);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.
});

describe("mapLine", () => {
  it("should change the ENTIRE center line to be 67 colored)", () => {
    const blackImage = Image.create(5, 15, COLORS.BLACK);
    mapLine(blackImage, 7, (c: Color) => [c[0] + 6, 67, c[2] + 7]);
    for (let i = 0; i < blackImage.width; i++) {
      assert(blackImage.getPixel(i, 7)[0] === 6, "The red channel should be 6.");
      assert(blackImage.getPixel(i, 7)[1] === 67, "The green channel should be 67.");
      assert(blackImage.getPixel(i, 7)[2] === 7, "The blue channel should be 7.");
    }
  });

  it("should not modify the img when lineNo is less than zero", () => {
    const blackImage = Image.create(5, 5, COLORS.BLACK);
    const imgToModify = blackImage.copy();
    mapLine(imgToModify, -1, (c: Color) => [c[0] + 6, 67, c[2] + 7]);
    expect(imgToModify).toEqual(blackImage);
  });

  it("should not modify the img when lineNo equals the img height", () => {
    const blackImage = Image.create(5, 5, COLORS.BLACK);
    const imgToModify = blackImage.copy();
    mapLine(imgToModify, imgToModify.height, (c: Color) => [c[0] + 6, 67, c[2] + 7]);
    expect(imgToModify).toEqual(blackImage);
  });

  it("should not modify the img when lineNo greater than the img height", () => {
    const blackImage = Image.create(5, 5, COLORS.BLACK);
    const imgToModify = blackImage.copy();
    mapLine(imgToModify, imgToModify.height + 67, (c: Color) => [c[0] + 6, 67, c[2] + 7]);
    expect(imgToModify).toEqual(blackImage);
  });

  // More tests for mapLine go here.
});

describe("imageMap", () => {
  it("should change every pixel to be 67 colored)", () => {
    const blackImage = Image.create(3, 3, COLORS.BLACK);
    imageMap(blackImage, (c: Color) => [c[0] + 6, 67, c[2] + 7]);
    for (let i = 0; i < blackImage.width; i++)
      for (let j = 0; j < blackImage.height; j++) {
        assert(blackImage.getPixel(i, j)[0] === 6, "The red channel should be 6.");
        assert(blackImage.getPixel(i, j)[1] === 67, "The green channel should be 67.");
        assert(blackImage.getPixel(i, j)[2] === 7, "The blue channel should be 7.");
      }
  });

  // More tests for imageMap go here.
});

describe("mapToGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(15, 15, COLORS.BLACK);
    const gbImage = mapToGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(15, 15, COLORS.BLACK);
    const gbImage = mapToGreen(blackImage);
    const p = gbImage.getPixel(7, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  // More tests for mapToGreen go here.
});

describe("mapFlipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(15, 15, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = mapFlipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  it("should correctly flip the center", () => {
    const whiteImage = Image.create(15, 15, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(7, 7, [100, 0, 150]);
    const flippedWhiteImage = mapFlipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(7, 7);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for mapFlipColors go here.
});
