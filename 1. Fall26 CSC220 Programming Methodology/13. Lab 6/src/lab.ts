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
  const N = Math.min(randomPositiveInteger(), 3);
  const arr = genArray(N);
  assert(arr.length == N, "Ensure N rows");
  assert(arr.length == arr[0].length, "Ensure square matrix");
  for (let i = 0; i < arr.length; i++) {
    const uniqueRowValues: number[] = [];
    for (let j = 0; j < N; j++) {
      const value = arr[i][j];
      assert(value >= 0 && value < N, "Ensure values are in range");
      assert(!uniqueRowValues.includes(value), "Ensure row values are unique");
      uniqueRowValues.push(value);
    }
    const uniqueColValues: number[] = [];
    for (let j = 0; j < N; j++) {
      const value = arr[j][i];
      assert(value >= 0 && value < N, "Ensure values are in range");
      assert(!uniqueColValues.includes(value), "Ensure column values are unique");
      uniqueColValues.push(value);
    }
  }
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
  private firstIterator: Iterator<T>;
  private secondIterator: Iterator<T>;
  private firstDone: boolean;
  private secondDone: boolean;
  private firstsTurn: boolean;
  constructor(a: Iterable<T>, b: Iterable<T>) {
    // TODO: Initialize state.
    this.firstIterator = a[Symbol.iterator]();
    this.secondIterator = b[Symbol.iterator]();
    this.firstDone = false;
    this.secondDone = false;
    this.firstsTurn = true;
  }

  next(): IteratorResult<T> {
    // TODO: Execute iteration logic.
    if (this.firstsTurn && !this.firstDone) {
      const result = this.firstIterator.next();
      this.firstsTurn = false;
      if (result.done) {
        this.firstDone = true;
        return this.secondIterator.next();
      }
      return result;
    } else if (!this.firstsTurn && !this.secondDone) {
      const result = this.secondIterator.next();
      this.firstsTurn = true;
      if (result.done) {
        this.secondDone = true;
        return this.firstIterator.next();
      }
      return result;
    } else {
      return { done: true, value: undefined };
    }
  }

  // TODO: Finish implementing the IterableIterator interface.
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}

// After implementing the class, uncomment either example and run npm run start.
// Using next() to inspect individual results:
// const it = new AlternatingIterator([1, 2, 3], [10, 20, 30, 40]);
// console.log(it.next()); // { done: false, value: 1 }
// console.log(it.next()); // { done: false, value: 10 }
// Keep calling next() to get 2, 20, 3, 30, 40, then { done: true, value: undefined }.

// Using for...of to visit every value:
for (const value of new AlternatingIterator([1, 2, 3], [10, 20, 30, 40])) {
  console.log(value);
}
//Expected output: 1, 10, 2, 20, 3, 30, 40.
