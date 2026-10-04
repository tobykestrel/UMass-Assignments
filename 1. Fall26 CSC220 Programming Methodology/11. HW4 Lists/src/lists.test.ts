import { listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
} from "./lists.js";

describe("insertOrdered", () => {
  // Tests for insertOrdered go here
  it("should insert an element into the correct position in an ordered list", () => {
    const simpleList = arrayToList([1, 2, 3, 5]);
    const newList = insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should work even with negative numbers", () => {
    const simpleList = arrayToList([-5, 1, 2, 3, 5]);
    const newList = insertOrdered(simpleList, -4);
    expect(listToArray(newList)).toEqual([-5, -4, 1, 2, 3, 5]);
  });

  it("should work with zero", () => {
    const simpleList = arrayToList([1, 2, 3, 5]);
    const newList = insertOrdered(simpleList, 0);
    expect(listToArray(newList)).toEqual([0, 1, 2, 3, 5]);
  });

  it("should work with duplicates", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4, 4, 5]);
  });

  it("should work with an empty list", () => {
    const simpleList = arrayToList([]);
    const newList = insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([4]);
  });

  it("should be inserted as the last element if its greater than all other elements", () => {
    const simpleList = arrayToList([1, 2, 3]);
    const newList = insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });

  it("should be inserted as the first element if its less than all other elements", () => {
    const simpleList = arrayToList([2, 3, 4]);
    const newList = insertOrdered(simpleList, 1);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here
  it("should collect every nth element in reverse order", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNRev(simpleList, 2);
    expect(listToArray(newList)).toEqual([4, 2]);
  });

  it("should return an empty list when n is larger than the list length", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNRev(simpleList, 6);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should get the nth elements BEFORE flipping the list", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newList = everyNRev(simpleList, 3);
    expect(listToArray(newList)).toEqual([6, 3]); // not [5, 2]
  });

  it("should just reverse the list if n is 1", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNRev(simpleList, 1);
    expect(listToArray(newList)).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("everyNCond", () => {
  // Tests for everyNCond go here
  it("should collect every nth element in reverse order", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 2, x => x > 0);
    expect(listToArray(newList)).toEqual([2, 4]);
  });

  it("should return an empty list when n is larger than the list length", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 6, x => x > 0);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should get the nth elements BEFORE flipping the list", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newList = everyNCond(simpleList, 3, x => x > 0);
    expect(listToArray(newList)).toEqual([3, 6]); // not [5, 2]
  });

  it("should preserve the list if n is 1 and the condition applies to all elements", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 1, x => x > 0);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should exclude nth elements that don't satisfy the condition", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 1, x => x != 3);
    expect(listToArray(newList)).toEqual([1, 2, 4, 5]);
  });
});

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here
  it("should create a list without the elements that don't satisfy the condition with their neighbors", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 2, 7, 10]);
    const newList = keepTrendMiddles(simpleList, (l, m, r) => m > l && r > m);
    expect(listToArray(newList)).toEqual([2, 3, 7]);
  });

  it("should always cut out the first and last elements", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const newList = keepTrendMiddles(simpleList, (l, m, r) => m > l && r > m);
    expect(listToArray(newList)).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here
  it("should create a list with only local maxima", () => {
    const simpleList = arrayToList([1, 2, 1, 4, 5, 3, 10]);
    const newList = keepLocalMaxima(simpleList);
    expect(listToArray(newList)).toEqual([2, 5]);
  });

  it("should always cut out the first and last elements", () => {
    const simpleList = arrayToList([10, 1, 2, 1, 10]);
    const newList = keepLocalMaxima(simpleList);
    expect(listToArray(newList)).toEqual([2]);
  });

  it("should work with zeroes on either end", () => {
    const simpleList = arrayToList([0, 1, 0]);
    const newList = keepLocalMaxima(simpleList);
    expect(listToArray(newList)).toEqual([1]);
  });

  it("should not count equal elements as a local maxima", () => {
    const simpleList = arrayToList([1, 3, 3, 1, 4, 1]);
    const newList = keepLocalMaxima(simpleList);
    expect(listToArray(newList)).toEqual([4]);
  });
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here
  it("should create a list with only local minima", () => {
    const simpleList = arrayToList([1, 2, 1, 4, 5, 3, 10]);
    const newList = keepLocalMinima(simpleList);
    expect(listToArray(newList)).toEqual([1, 3]);
  });

  it("should always cut out the first and last elements", () => {
    const simpleList = arrayToList([0, 2, 1, 2, 0]);
    const newList = keepLocalMinima(simpleList);
    expect(listToArray(newList)).toEqual([1]);
  });

  it("should work with zeroes on either end", () => {
    const simpleList = arrayToList([0, -1, 0]);
    const newList = keepLocalMinima(simpleList);
    expect(listToArray(newList)).toEqual([-1]);
  });

  it("should not count equal elements as a local minima", () => {
    const simpleList = arrayToList([2, 1, 1, 3, 2, 5]);
    const newList = keepLocalMinima(simpleList);
    expect(listToArray(newList)).toEqual([2]);
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here
  it("should create a list with only local minima and maxima", () => {
    const simpleList = arrayToList([1, 2, 1, 4, 5, 3, 10]);
    const newList = keepLocalMinimaAndMaxima(simpleList);
    expect(listToArray(newList)).toEqual([2, 1, 5, 3]);
  });

  it("should always cut out the first and last elements", () => {
    const simpleList = arrayToList([1, 2, 1, 2, 1]);
    const newList = keepLocalMinimaAndMaxima(simpleList);
    expect(listToArray(newList)).toEqual([2, 1, 2]);
  });

  it("should work with zeroes on either end", () => {
    const simpleList = arrayToList([0, 2, 1, 2, 0]);
    const newList = keepLocalMinimaAndMaxima(simpleList);
    expect(listToArray(newList)).toEqual([2, 1, 2]);
  });

  it("should not count equal elements as local maxima or local minima", () => {
    const simpleList = arrayToList([1, 3, 3, 1, 1, 5, 3, 5, 3]);
    const newList = keepLocalMinimaAndMaxima(simpleList);
    expect(listToArray(newList)).toEqual([5, 3, 5]);
  });
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("should create a list of the chain products of non negatives", () => {
    const simpleList = arrayToList([1, 2, 3, -1, 2, 5, -1, 7, 7]);
    const newList = nonNegativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([1, 2, 6, 2, 10, 7, 49]);
  });

  it("should return an empty list when there are only negative numbers", () => {
    const simpleList = arrayToList([-1, -2, -3, -4, -5]);
    const newList = nonNegativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should return an empty list when there are no numbers", () => {
    const simpleList = arrayToList([]);
    const newList = nonNegativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should count 0 as non negative", () => {
    const simpleList = arrayToList([0, 1, 2, -1, 5, 6, 0]);
    const newList = nonNegativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([0, 0, 0, 5, 30, 0]);
  });
});

describe("negativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("should create a list of the chain products of negatives", () => {
    const simpleList = arrayToList([-1, -2, -3, 1, -2, -5, 1, -7, -7]);
    const newList = negativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([-1, 2, -6, -2, 10, -7, 49]);
  });

  it("should return an empty list when there are only positive numbers", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = negativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should return an empty list when there are no numbers", () => {
    const simpleList = arrayToList([]);
    const newList = negativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should count 0 as non negative", () => {
    const simpleList = arrayToList([-1, -2, 0, -5, -6, 0, -2]);
    const newList = negativeProducts(simpleList);
    expect(listToArray(newList)).toEqual([-1, 2, -5, 30, -2]);
  });
});

describe("deleteFirst", () => {
  // Tests for deleteFirst go here
  it("should delete ONLY the first instance of the given element", () => {
    const simpleList = arrayToList([1, 2, 3, 2, 4, 2, 5]);
    const newList = deleteFirst(simpleList, 2);
    expect(listToArray(newList)).toEqual([1, 3, 2, 4, 2, 5]);
  });

  it("should not change anything if the element is not found", () => {
    const simpleList = arrayToList([1, 2, 3, 4]);
    const newList = deleteFirst(simpleList, 5);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });
});

describe("deleteLast", () => {
  // Tests for deleteLast go here
  it("should delete ONLY the last instance of the given element", () => {
    const simpleList = arrayToList([1, 2, 3, 2, 4, 2, 5]);
    const newList = deleteLast(simpleList, 2);
    expect(listToArray(newList)).toEqual([1, 2, 3, 2, 4, 5]);
  });

  it("should not change anything if the element is not found", () => {
    const simpleList = arrayToList([1, 2, 3, 4]);
    const newList = deleteLast(simpleList, 5);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });
});

describe("squashList", () => {
  // Tests for squashList go here

  it("should squish lists into their sum values", () => {
    const simpleList = arrayToList([1, 2, arrayToList([1, 2]), 4]);
    const newList = squashList(simpleList);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });

  it("should return the same list when there are no nested lists", () => {
    const simpleList = arrayToList([1, 2, 3, 4]);
    const newList = squashList(simpleList);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4]);
  });

  it("should work with negative numbers", () => {
    const simpleList = arrayToList([-1, -2, arrayToList([-1, -2]), -4]);
    const newList = squashList(simpleList);
    expect(listToArray(newList)).toEqual([-1, -2, -3, -4]);
  });

  it("should count an empty list as zero", () => {
    const simpleList = arrayToList([1, 2, arrayToList([]), 4]);
    const newList = squashList(simpleList);
    expect(listToArray(newList)).toEqual([1, 2, 0, 4]);
  });
});
