import { composeFunctions, cyclic, rateLimiter, byParity, vendingMachine, wageChange, sineSeries } from "./closures";

describe("composeFunctions", () => {
  // Write tests for composeFunctions here

  it("should return a new correct results for EVERY function", () => {
    const compose = composeFunctions([(x: number) => x + 1, (x: number) => x + 5, (x: number) => x * 2]);
    expect(compose(3)).toEqual([3, 4, 9, 18]);
  });

  it("should apply each transformation in order to the previous result", () => {
    const compose = composeFunctions([(n: number) => n + 2, (n: number) => n * 3, (n: number) => n - 4]);
    expect(compose(5)).toEqual([5, 7, 21, 17]);
  });

  it("should throw an error if the funs array is empty", () => {
    const compose = composeFunctions([]);
    expect(() => compose(3)).toThrow("funs array is empty");
  });
});

describe("cyclic", () => {
  // Write tests for cyclic here

  it("should circle back to the beginning of the array after finishing", () => {
    const cycle = cyclic([1, 2, 3]);
    expect(cycle()).toBe(1);
    expect(cycle()).toBe(2);
    expect(cycle()).toBe(3);
    expect(cycle()).toBe(1);
    expect(cycle()).toBe(2);
    expect(cycle()).toBe(3);
  });

  it("should keep returning the same value for a single-item array", () => {
    const cycle = cyclic([42]);
    expect(cycle()).toBe(42);
    expect(cycle()).toBe(42);
    expect(cycle()).toBe(42);
  });

  it("should throw an error if the values array is empty", () => {
    expect(() => {
      const cycle = cyclic([]);
      cycle();
    }).toThrow("values array is empty");
  });

  it("should allow any combination of value types", () => {
    const cycle = cyclic([1, 0, -1, null, "", "abc", "z", 1.5, true, false, undefined]);
    expect(cycle()).toBe(1);
    expect(cycle()).toBe(0);
    expect(cycle()).toBe(-1);
    expect(cycle()).toBe(null);
    expect(cycle()).toBe("");
    expect(cycle()).toBe("abc");
    expect(cycle()).toBe("z");
    expect(cycle()).toBe(1.5);
    expect(cycle()).toBe(true);
    expect(cycle()).toBe(false);
    expect(cycle()).toBe(undefined);
  });
});

describe("rateLimiter", () => {
  // Write tests for rateLimiter here

  it("should limit the number of times a function can be called before returning undefined", () => {
    const limitedFunction = rateLimiter((x: number, y: number) => x + y, 2);
    expect(limitedFunction(5, 1)).toBe(6);
    expect(limitedFunction(2, 5)).toBe(7);
    expect(limitedFunction(67, 67)).toBe(undefined);
  });

  it("should deny all calls when the limit is zero", () => {
    const limitedFunction = rateLimiter((x: number, y: number) => x + y, 0);
    expect(limitedFunction(1, 2)).toBe(undefined);
    expect(limitedFunction(3, 4)).toBe(undefined);
  });
});

describe("byParity", () => {
  // Write tests for byParity here
  it("should apply the even function for even numbers", () => {
    const byParityFunc = byParity(
      (n: number) => n * 2,
      (n: number) => n * 3
    );
    expect(byParityFunc(2)).toBe(4);
    expect(byParityFunc(4)).toBe(8);
  });

  it("should apply the even function for odd numbers", () => {
    const byParityFunc = byParity(
      (n: number) => n * 2,
      (n: number) => n * 3
    );
    expect(byParityFunc(3)).toBe(9);
    expect(byParityFunc(5)).toBe(15);
  });

  it("should processed zero as even", () => {
    const byParityFunc = byParity(
      (n: number) => n * 2,
      (n: number) => n + 3
    );
    expect(byParityFunc(0)).toBe(0);
  });

  it("should should work with negative numbers", () => {
    const byParityFunc = byParity(
      (n: number) => n * 2,
      (n: number) => n * 3
    );
    expect(byParityFunc(-2)).toBe(-4);
    expect(byParityFunc(-3)).toBe(-9);
  });
});

describe("vendingMachine", () => {
  // Write tests for vendingMachine here

  it("should return undefined if theres no more stock", () => {
    const vMachine = vendingMachine(2.99, 2);
    vMachine(3);
    vMachine(3);
    expect(vMachine(3)).toBe(undefined);
  });

  it("should return undefined if there are insufficient funds", () => {
    const vMachine = vendingMachine(2.99, 3);
    expect(vMachine(2.98)).toBe(undefined);
    expect(vMachine(2.97)).toBe(undefined);
    expect(vMachine(1)).toBe(undefined);
    expect(vMachine(0)).toBe(undefined);
    expect(vMachine(-1)).toBe(undefined);
    expect(vMachine(-99)).toBe(undefined);
  });

  it("should return exact change", () => {
    const vMachine = vendingMachine(2.99, 3);
    expect(vMachine(3)).toBe(0.01);
    expect(vMachine(5)).toBe(2.01);
    expect(vMachine(2.99)).toBe(0);
  });

  it("should NOT subtract a stock if there are insufficient funds", () => {
    const vMachine = vendingMachine(2.99, 1);
    vMachine(1.99);
    expect(vMachine(3)).toBe(0.01);
  });
});

describe("wageChange", () => {
  // Write tests for wageChange here

  it("should return NaN if startYr is after endYr", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(1000, 2020, 2010)).toBe(NaN);
    expect(wChg(1000, 2000, 1999)).toBe(NaN);
  });

  it("should return the same wage if startYr is endYr", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(1000, 2020, 2020)).toBe(1000);
    expect(wChg(1500, 1999, 1999)).toBe(1500);
  });

  it("should return NaN if startYr is before 1970", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(1000, 1969, 2000)).toBe(NaN);
    expect(wChg(1000, 1968, 2020)).toBe(NaN);
    expect(wChg(1000, 0, 2020)).toBe(NaN);
  });

  it("should return NaN if endYr is after 2026", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(1000, 2000, 2027)).toBe(NaN);
    expect(wChg(1000, 2000, 2028)).toBe(NaN);
    expect(wChg(1000, 2000, 3067)).toBe(NaN);
  });

  it("should return NaN if startWage is less than 1", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(0, 2000, 2001)).toBe(NaN);
    expect(wChg(-1, 2000, 2002)).toBe(NaN);
    expect(wChg(-67, 2000, 2003)).toBe(NaN);
  });

  it("should apply calcNew exactly how many years from start to end", () => {
    const wChg = wageChange((_yr: number, prev: number) => prev + 100);
    expect(wChg(1000, 2000, 2008)).toBe(1800);
    expect(wChg(1000, 2000, 2005)).toBe(1500);
    expect(wChg(1000, 2000, 2010)).toBe(2000);
  });
});

describe("sineSeries", () => {
  // Write tests for sineSeries here

  it("should change nothing if moreTerms is set to 0", () => {
    const sin5 = sineSeries(5);
    expect(sin5(1)).toBe(5);
    expect(sin5(0)).toBe(5);
  });

  it("should default moreTerms to 1 if nothing is specified", () => {
    const sin5 = sineSeries(5);
    expect(sin5(1)).toBe(5);
    expect(sin5()).toBeCloseTo(-95 / 6, 5); // k=3
  });

  it("should do the exact amount of recursion as specified by moreTerms", () => {
    const sin5 = sineSeries(5);
    expect(sin5(1)).toBe(5); // k=1
    expect(sin5(2)).toBeCloseTo(245 / 24, 5); // k=5
    expect(sin5(1)).toBeCloseTo(-5335 / 1008, 5); // k=7
    expect(sin5(3)).toBeCloseTo(-0.937584049, 9); // k=13
  });

  it("should leave the current value unchanged when moreTerms is negative", () => {
    const sin5 = sineSeries(5);
    expect(sin5(1)).toBe(5);
    expect(sin5(-2)).toBe(5);
    expect(sin5(1)).toBeCloseTo(-95 / 6, 5);
  });
});
