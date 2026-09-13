/*
Toby Hansen
Sep 10 2026
CSC220 Lec2
*/

// CUSTOM filter function, remove items in an array that do not conform.
function customFilter<T>(values: T[], mask: (value: T) => boolean): T[]  {
    const result: T[] = [];
    for (const val  of values) {
        if (mask(val)) result.push(val);
    }
    return result;
}

// Returns bool of whether a string is lowercase only.
function isNotLowercaseOnly(word: string) {
    return !(word == word.toLowerCase());
}

// Program test for custom filter.
const wordsWithOnlyLower = ["ABC", "abc", "Abc"];
const wordsWithoutOnlyLower = customFilter(wordsWithOnlyLower, isNotLowercaseOnly);
console.log(`Array with mixedcase words             : ${wordsWithOnlyLower}`);
console.log(`Array with lowercase-only words removed: ${wordsWithoutOnlyLower}`);

