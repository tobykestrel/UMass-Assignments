import { rotateRight } from "./lab.js";

// Your tests go here
describe("rotateRight", () => {
  it("should rotate the array completely to the right", () => {
    const output = rotateRight([1, 2, 3], 1);

    expect(output).toEqual([3, 1, 2]);
  });
  it("should throw an error if the input has negative numbers", () => {
    const output = () => rotateRight([1, 2, 3], -1);

    expect(output).toThrow();
  });
  it("should throw an error if the input is not a number", () => {
    const output = () => rotateRight([1, 2, 3], NaN);

    expect(output).toThrow();
  });
});
