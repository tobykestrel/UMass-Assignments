import { GenericFunction } from "../include/types.js";

export function composeFunctions<T>(funs: GenericFunction<T>[]): (x: T) => T[] {
  // TODO
  return (x: T): T[] => {
    const resultsArray: T[] = [x];
    if (funs.length == 0) throw new Error("funs array is empty");
    for (let i = 0; i < funs.length; i++) {
      if (typeof funs[i] !== "function") throw new Error("funs[" + i.toString() + "] is not a function");
      resultsArray.push(funs[i](resultsArray[i]));
    }
    return resultsArray;
  };
}

export function cyclic<T>(values: T[]): () => T {
  // TODO
  if (values.length == 0) throw new Error("values array is empty");
  let next = 0;
  return (): T => {
    const value = values[next];
    next++;
    if (next == values.length) next = 0;
    return value;
  };
}

export function rateLimiter<T, R>(func: (x: T, y: T) => R, limit: number): (x: T, y: T) => R | undefined {
  // TODO
  let timesCalled = 0;
  return (x, y) => {
    if (timesCalled >= limit) return undefined;
    timesCalled++;
    return func(x, y);
  };
}

export function byParity(evenFunc: (n: number) => number, oddFunc: (n: number) => number): (n: number) => number {
  // TODO
  return (n: number) => {
    return n % 2 === 0 ? evenFunc(n) : oddFunc(n);
  };
}

export function vendingMachine(price: number, stock: number): (amount: number) => number | undefined {
  // TODO
  const costOfItem = price;
  let remainingStock = stock;
  return (amount: number) => {
    if (remainingStock <= 0) return undefined;
    if (amount < costOfItem) return undefined;
    remainingStock--;
    return Math.round((amount - costOfItem) * 100) / 100;
  };
}

export function wageChange(
  calcNew: (yr: number, prevWage: number) => number
): (startWage: number, startYr: number, endYr: number) => number {
  // TODO
  return (startWage: number, startYr: number, endYr: number) => {
    if (startYr > endYr) return NaN;
    if (startYr < 1970) return NaN;
    if (endYr > 2026) return NaN;
    if (startWage < 1) return NaN;
    let currentWage = startWage;
    for (let i = startYr + 1; i <= endYr; i++) currentWage = calcNew(i, currentWage);
    return currentWage;
  };
}

export function sineSeries(x: number): (moreTerms?: number) => number {
  // TODO
  let k = -1;
  let add = false;
  let sineVal = 0;
  function factorial(n: number): number {
    if (n < 0) return 0;
    if (n == 0) return 1;
    return n * factorial(n - 1);
  }
  return (moreTerms = 1) => {
    for (let i = 0; i < moreTerms; i++) {
      k += 2;
      add = !add;
      if (add) sineVal += Math.pow(x, k) / factorial(k);
      if (!add) sineVal -= Math.pow(x, k) / factorial(k);
    }
    return sineVal;
  };
}
