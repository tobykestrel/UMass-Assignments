import assert from "assert";

/**
 *  Exercise 1: Property Based Testing
 *
 * Implement oracle(genArray: (num: number) => number[][]).
 * Take a function that generates a 2D array of numbers.
 * Use assertions to test that the generated array satisfies the properties
 * described below.
 *
 * An n×n array of numbers such that each row and column is a permutation of
 * the numbers from 0 to n-1 (assume n is non-negative).
 *
 * The function randomPositiveInteger() is provided for your convenience.
 * Use higher-order functions when appropriate.
 * Try to write your solution in O(n^2).
 */

function randomPositiveInteger() {
  return Math.floor(Math.random() * 1000 + 1);
}

export function oracle(genArray: (num: number) => number[][]) {
  // TODO: Implement property-based tests for genArray.
}

/**
 * Exercise 2: Iterators
 *
 * Implement AlternatingIterator<T>.
 * Take two iterables and yield their elements alternately, starting with the first.
 * When one iterator is exhausted, continue yielding elements from the other.
 * Finish when both iterators are exhausted.
 * The result should be an iterable iterator, usable with next() and for...of.
 *
 * Example: [1, 2, 3] and [10, 20, 30, 40] yield 1, 10, 2, 20, 3, 30, 40.
 */

export class AlternatingIterator<T> implements IterableIterator<T> {
  // TODO: Declare necessary fields.

  constructor(a: Iterable<T>, b: Iterable<T>) {
    // TODO: Initialize state.
  }

  next(): IteratorResult<T> {
    // TODO: Execute iteration logic.
    throw new Error("Not implemented");
  }

  // TODO: Finish implementing the IterableIterator interface.
}

// After implementing the class, uncomment either example and run npm run start.
// Using next() to inspect individual results:
// const it = new AlternatingIterator([1, 2, 3], [10, 20, 30, 40]);
// console.log(it.next()); // { done: false, value: 1 }
// console.log(it.next()); // { done: false, value: 10 }
// Keep calling next() to get 2, 20, 3, 30, 40, then { done: true, value: undefined }.

// Using for...of to visit every value:
// for (const value of new AlternatingIterator([1, 2, 3], [10, 20, 30, 40])) {
//   console.log(value);
// }
// Expected output: 1, 10, 2, 20, 3, 30, 40.
