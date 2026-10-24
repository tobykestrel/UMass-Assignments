import { BusinessQuery, cycle, pairwise } from "./iterators-generators";

describe("pairwise", () => {
  // Write tests for pairwise here
  it("should yield pairs of consecutive elements", () => {
    const result = Array.from(pairwise([1, 2, 3, 4]));
    expect(result).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  it("should yield an empty array for an empty input", () => {
    const result = Array.from(pairwise([]));
    expect(result).toEqual([]);
  });

  it("should yield an empty array for a single element input", () => {
    const result = Array.from(pairwise([1]));
    expect(result).toEqual([]);
  });

  it("should yield a single array element for a two element input", () => {
    const result = Array.from(pairwise([1, 2]));
    expect(result).toEqual([[1, 2]]);
  });
});

describe("cycle", () => {
  // Write tests for cycle here
  it("should yield elements from multiple iterables in a round-robin fashion", () => {
    const result = Array.from(cycle([[1, 2], [3, 4], [5]]));
    expect(result).toEqual([1, 3, 5, 2, 4]);
  });

  it("should yield an empty array for an empty input", () => {
    const result = Array.from(cycle([]));
    expect(result).toEqual([]);
  });

  it("should work even if only one iterable is in the input", () => {
    const result = Array.from(cycle([[1, 2, 3]]));
    expect(result).toEqual([1, 2, 3]);
  });

  it("should skip exhausted iterables", () => {
    const result = Array.from(cycle([[1, 2], [3], [4, 5, 6]]));
    expect(result).toEqual([1, 3, 4, 2, 5, 6]);
  });
});

describe("BusinessQuery.slice", () => {
  // Write tests for BusinessQuery.slice here
  it("should yield elements from the specified start index to the end index", () => {
    const query = new BusinessQuery([
      { business_id: "0" },
      { business_id: "1" },
      { business_id: "2" },
      { business_id: "3" },
      { business_id: "4" },
    ]);
    expect(Array.from(query.slice(1, 4))).toEqual([{ business_id: "1" }, { business_id: "2" }, { business_id: "3" }]);
  });

  it("should yield elements from start index to end of set if no end index is provided", () => {
    const query = new BusinessQuery([
      { business_id: "0" },
      { business_id: "1" },
      { business_id: "2" },
      { business_id: "3" },
      { business_id: "4" },
    ]);
    expect(Array.from(query.slice(2))).toEqual([{ business_id: "2" }, { business_id: "3" }, { business_id: "4" }]);
  });

  it("should yield an empty array if the start index is greater than or equal to the length of the iterable", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(Array.from(query.slice(5))).toEqual([]);
  });

  it("should throw a slice error if the start index is negative", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(() => Array.from(query.slice(-1))).toThrow("slice: start and end must be non-negative");
  });

  it("should throw a slice error if the end index is negative", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(() => Array.from(query.slice(0, -1))).toThrow("slice: start and end must be non-negative");
  });

  it("should work fine and just go to the end of the actual iterable if the end index is too big", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(Array.from(query.slice(1, 5))).toEqual([{ business_id: "1" }, { business_id: "2" }]);
  });

  it("should throw a slice error if the start index is greater than the end index", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(() => Array.from(query.slice(2, 1))).toThrow("slice: start must not be greater than end");
  });

  it("should throw a slice error if the start index is not an integer", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(() => Array.from(query.slice(1.5, 3))).toThrow("slice: start and end must be integers");
  });

  it("should throw a slice error if the end index is not an integer", () => {
    const query = new BusinessQuery([{ business_id: "0" }, { business_id: "1" }, { business_id: "2" }]);
    expect(() => Array.from(query.slice(1, 2.5))).toThrow("slice: start and end must be integers");
  });
});

describe("BusinessQuery.filter", () => {
  // Write tests for BusinessQuery.filter here
  it("should yield only the elements that satisfy the filter function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
    const filtered = query.filter(biz => biz.stars !== undefined && biz.stars >= 4);
    expect(Array.from(filtered)).toEqual([
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
  });

  it("should yield an empty array if no elements satisfy the filter function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
    ]);
    const filtered = query.filter(biz => biz.stars !== undefined && biz.stars >= 5);
    expect(Array.from(filtered)).toEqual([]);
  });

  it("should yield all elements if all satisfy the filter function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
    const filtered = query.filter(biz => biz.stars !== undefined && biz.stars >= 3);
    expect(Array.from(filtered)).toEqual([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
  });
});

describe("BusinessQuery.exclude", () => {
  // Write tests for BusinessQuery.exclude here
  it("should yield only the elements that do not satisfy the exclude function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
    const excluded = query.exclude(biz => biz.stars !== undefined && biz.stars >= 4);
    expect(Array.from(excluded)).toEqual([{ business_id: "0", stars: 3 }]);
  });

  it("should yield an empty array if all elements satisfy the exclude function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
    ]);
    const excluded = query.exclude(biz => biz.stars !== undefined && biz.stars >= 3);
    expect(Array.from(excluded)).toEqual([]);
  });

  it("should yield all elements if none satisfy the exclude function", () => {
    const query = new BusinessQuery([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
    const excluded = query.exclude(biz => biz.stars !== undefined && biz.stars >= 6);
    expect(Array.from(excluded)).toEqual([
      { business_id: "0", stars: 3 },
      { business_id: "1", stars: 4 },
      { business_id: "2", stars: 5 },
    ]);
  });
});
