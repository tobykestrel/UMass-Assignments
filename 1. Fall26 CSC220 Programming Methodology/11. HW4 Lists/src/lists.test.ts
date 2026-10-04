import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
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
    const newList =insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4, 5]);
  });
  
  it("should work even with negative numbers", () => {
    const simpleList = arrayToList([1, 2, 3, 5]);
    const newList =insertOrdered(simpleList, -4);
    expect(listToArray(newList)).toEqual([-4, 1, 2, 3, 5]);
  });
  
  it("should work with zero", () => {
    const simpleList = arrayToList([1, 2, 3, 5]);
    const newList =insertOrdered(simpleList, 0);
    expect(listToArray(newList)).toEqual([0, 1, 2, 3, 5]);
  });

  it("should work with duplicates", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList =insertOrdered(simpleList, 4);
    expect(listToArray(newList)).toEqual([1, 2, 3, 4,4, 5]);
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
    const newList = everyNCond(simpleList, 2, (x) => x > 0);
    expect(listToArray(newList)).toEqual([4, 2]);
  });

  it("should return an empty list when n is larger than the list length", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 6, (x) => x > 0);
    expect(listToArray(newList)).toEqual([]);
  });

  it("should get the nth elements BEFORE flipping the list", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5, 6, 7]);
    const newList = everyNCond(simpleList, 3, (x) => x > 0);
    expect(listToArray(newList)).toEqual([6, 3]); // not [5, 2]
  });

  it("should just reverse the list if n is 1", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 1, (x) => x > 0);
    expect(listToArray(newList)).toEqual([5, 4, 3, 2, 1]);
  });

  it("should exclude nth elements that don't satisfy the condition", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 5]);
    const newList = everyNCond(simpleList, 1, (x) => x != 3);
    expect(listToArray(newList)).toEqual([5, 4, 2, 1]);
  });
});

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here
  it("should create a list without the elements that don't satisfy the condition with their neighbors", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 2, 7, 10]);
    const newList = keepTrendMiddles(simpleList, (l,m,r) => m > l && r > m);
    expect(listToArray(newList)).toEqual([7, 3, 2]);
  });

  it("should always cut out the first and last elements", () => {
    const simpleList = arrayToList([1, 2, 3, 4, 6, 6, 7, 8, 9]);
    const newList = keepTrendMiddles(simpleList, (l,m,r) => m > l && r > m);
    expect(listToArray(newList)).toEqual([8, 7, 6, 5, 4, 3, 2]);
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here
});

describe("negativeProducts", () => {
  // Tests for nonNegativeProducts go here
});

describe("deleteFirst", () => {
  // Tests for deleteFirst go here
});

describe("deleteLast", () => {
  // Tests for deleteLast go here
});

describe("squashList", () => {
  // Tests for squashList go here
});