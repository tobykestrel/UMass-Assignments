// Map Review

// Sample map implementation
function map<T, U>(a: T[], f: (x: T) => U): U[] {
  const result: U[] = [];
  for (let i = 0; i < a.length; ++i) {
    const new_val: U = f(a[i]);
    result.push(new_val);
  }
  return result;
}

// Example:
function double(x: number): number {
  return 2 * x;
}

// Alternatively we can use an arrow function
const double2 = (x: number) => 2 * x;

const to_map_arr = [1, 2, 3, 4, 5];

const mappedArr1 = map(to_map_arr, double);
const mappedArr2 = to_map_arr.map(double2);

// What will mappedArr1 and mappedArr2 be?
declare const console: { log(message: string): void };
console.log(`mappedArr1: ${mappedArr1}`);
console.log(`mappedArr2: ${mappedArr2}`);

// Filter Review

// Sample filter implementation
function filter<T>(a: T[], f: (x: T) => boolean): T[] {
  const result: T[] = [];
  for (let i = 0; i < a.length; ++i) {
    const x = a[i];
    if (f(x)) {
      result.push(x);
    }
  }
  return result;
}

//Example:
function isEven(x: number): boolean {
  return x % 2 === 0;
}

// Again, we can use an arrow function
const isEven2 = (x: number) => x % 2 === 0;

const to_filter_arr = [1, 2, 3, 4, 5];

const filteredArr1 = filter(to_filter_arr, isEven);
const filteredArr2 = to_filter_arr.filter(isEven2);

// What will filteredArr1 and filteredArr2 be?
console.log(`filteredArr1: ${filteredArr1}`);
console.log(`filteredArr2: ${filteredArr2}`);

// In class exercises

/*
Toby Hansen
Sep 09, 2026
CSC220 Lab 1
*/

// Exercise 1
const arrayWithNegatives: number[][] = [
  [-1, -2, 3],
  [4, -5, -6],
  [-7, 8, -9],
];
const arrayNoNegatives = nonNegatives2D(arrayWithNegatives);
export function nonNegatives2D(arr: number[][]): number[][] {
  // remove all negative numbers
  return arr.map(row => row.filter(num => num >= 0));
}
console.log(`With Negatives: ${arrayWithNegatives.toString()}`);
console.log(`Without Negatives: ${arrayNoNegatives.toString()}`);

// Exercise 2
const arrayWithShortWords: string[][] = [
  ["12345", "123", "123456"],
  ["abc", "abcd", "abcde"],
  ["yo", "hi", "hello"],
];
const arrayNoShortWords = longWords2D(arrayWithShortWords);
export function longWords2D(text: string[][]): string[][] {
  // remove all words with less than 3 characters
  return text.map(row => row.filter(word => word.length > 3));
}
console.log(`With Short Words: ${arrayWithShortWords.toString()}`);
console.log(`Without Short Words: ${arrayNoShortWords.toString()}`);
