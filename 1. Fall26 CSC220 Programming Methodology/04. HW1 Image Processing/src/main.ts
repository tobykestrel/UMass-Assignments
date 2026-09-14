import { COLORS, Image } from "../include/image.js";
import { saturateGreen, flipColors, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

// Pre-existing red lines test
const imgWithRedLines = Image.loadImageFromGallery();
for (let x = 0; x < imgWithRedLines.width; ++x) {
  for (let y = 0; y < imgWithRedLines.height; y += 10) {
    imgWithRedLines.setPixel(x, y, COLORS.RED);
  }
}
imgWithRedLines.show("Image-With-Red-Lines");

// Saturate Green test (no map)
const greenTestImgNoMap = saturateGreen(Image.loadImageFromGallery("art"));
greenTestImgNoMap.show("Green-Test-No-Map");

// Saturate Green test with map
const greenTestImgWtMap = mapToGreen(Image.loadImageFromGallery("art"));
greenTestImgWtMap.show("Green-Test-Wt-Map");

// Flip Colors test (no map)
const flipTestImgNoMap = flipColors(Image.loadImageFromGallery("art"));
flipTestImgNoMap.show("Flip-Test-No-Map");

// Flip colors test with map
const flipTestImgWtMap = mapFlipColors(Image.loadImageFromGallery("art"));
flipTestImgWtMap.show("Flip-Test-Wt-Map");
