import { myFirstFunction } from "./setup.js";

describe("myFirstFunction", () => {
  it("returns false for all positive numbers", () => {
    // Generate a random positive number between 1 and 1000
    const input = Math.floor(Math.random() * 1000) + 1;

    // Run the function with the input
    const output = myFirstFunction(input);

    // Check that the output is false
    expect(output).toBeFalsy();
  });

  // This test has an issue. Use the debugger to find the issue!
  it("returns true for all even negative numbers", () => {
    // Generate a random negative even number
    const number = -1 * Math.floor(Math.random() * 1000) + 1;
    let input: number;

    if (number % 2 === 0) {
      input = number;
    } else {
      input = number - 1;
    }

    // Run the function with the input
    const output = myFirstFunction(input);

    // Check that the output is true
    expect(output).toBeTruthy();
  });

  // Implement the following test.
  it("Zero as input returns false", () => {
    // Write your testing code here!
    const input: number = 0;

    // Run the function with the input
    const output = myFirstFunction(input);

    // Check that the output is false
    expect(output).toBeFalsy();
  });
});
