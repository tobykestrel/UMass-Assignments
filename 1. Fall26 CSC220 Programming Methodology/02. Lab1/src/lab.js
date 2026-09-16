// Map Review
// Sample map implementation
function map(a, f) {
    const result = [];
    for (let i = 0; i < a.length; ++i) {
        const new_val = f(a[i]);
        result.push(new_val);
    }
    return result;
}
// Example:
function double(x) {
    return 2 * x;
}
// Alternatively we can use an arrow function
const double2 = (x) => 2 * x;
const to_map_arr = [1, 2, 3, 4, 5];
const mappedArr1 = map(to_map_arr, double);
const mappedArr2 = to_map_arr.map(double2);
console.log(`mappedArr1: ${mappedArr1}`);
console.log(`mappedArr2: ${mappedArr2}`);
// Filter Review
// Sample filter implementation
function filter(a, f) {
    const result = [];
    for (let i = 0; i < a.length; ++i) {
        const x = a[i];
        if (f(x)) {
            result.push(x);
        }
    }
    return result;
}
//Example:
function isEven(x) {
    return x % 2 === 0;
}
// Again, we can use an arrow function
const isEven2 = (x) => x % 2 === 0;
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
CSC220
*/
// Exercise 1
const arrayWithNegatives = [
    [-1, -2, 3],
    [4, -5, -6],
    [-7, 8, -9],
];
const arrayNoNegatives = nonNegatives2D(arrayWithNegatives);
export function nonNegatives2D(arr) {
    // remove all negative numbers
    return arr.map(row => row.filter(num => num >= 0));
}
console.log(arrayWithNegatives.toString());
console.log(arrayNoNegatives.toString());
// Exercise 2
const arrayWithShortWords = [
    ["12345", "123", "123456"],
    ["abc", "abcd", "abcde"],
    ["yo", "hi", "hello"],
];
const arrayNoShortWords = longWords2D(arrayWithShortWords);
export function longWords2D(text) {
    // remove all words with less than 3 characters
    return text.map(row => row.filter(word => word.length > 3));
}
console.log(arrayWithShortWords.toString());
console.log(arrayNoShortWords.toString());
//# sourceMappingURL=lab.js.map