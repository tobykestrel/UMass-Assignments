import { List, node, empty, reverseList, } from "../include/lists.js";

// Takes a list of numbers, assumed to be increasingly ordered, and a number x. 
// Returns a new list where x has been inserted in the appropriate position. 
// Allow insertion of existing numbers.
export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) return node(el, empty());
  const firstVal = lst.head();
  const theRest = lst.tail();
  if (el < firstVal) return node(el, lst);
  return node(firstVal, insertOrdered(theRest, el));
}

// Write a function that takes a list of some type T and a number n 
// (assumed to be a positive integer). It should return a list containing 
// every nth element from the input list, in reverse order (the nth element 
// appears last, the 2nd nth before it, ...). Use List.reduce.
export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  return lst.reduce(
    (accumulator, thisEl) => {
      const newCount = accumulator.count + 1;
      let nthEls = accumulator.nthElements;
      if (newCount % n == 0) nthEls = node(thisEl, nthEls);
      return { count: newCount, nthElements: nthEls };
    },
    { count: 0, nthElements: empty<T>() }
  ).nthElements;
}

// Write a function that takes a list of some type T, a number n (assumed to be a 
// positive integer), and a function cond: (e: T) => boolean. It should return a 
// list containing every nth element of those that satisfy cond, in the original order.
export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  return reverseList(lst.reduce(
    (accumulator, thisEl) => {
      const newIndex = accumulator.index + 1;
      let nthEls = accumulator.nthElements;
      if (newIndex % n == 0 && cond(thisEl)) nthEls = node(thisEl, nthEls);
      return { index: newIndex, nthElements: nthEls };
    },
    { index: 0, nthElements: empty<T>() }
  ).nthElements);
}

// Takes in a list of numbers and a function 
// allSatisfy: (prev: number, curr: number, next: number) => boolean. 
// Returns a list of numbers, keeping only those numbers curr from the 
// original list that have both a previous and next element, and for which 
// allSatisfy returns true when applied to the numbers in the given order.
export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  return lst.reduce(
    (accumulator, nextEl) => {
      let trendMids = accumulator.trendMiddles;
      if (!accumulator.prevEl && !accumulator.currentEl && 
        allSatisfy(accumulator.prevEl, accumulator.currentEl, nextEl)
      ) { trendMids = node(accumulator.currentEl, trendMids); }
      return { prevEl: accumulator.currentEl, currentEl: nextEl, trendMiddles: trendMids };
    },
    { prevEl: NaN, currentEl: NaN, trendMiddles: empty<number>() }
  ).trendMiddles;
}

// Take a list of numbers and returns a list of numbers where only the local 
// maxima from the original list are included in the same order. A local maximum 
// is a number that is preceded and followed in the list by smaller numbers.
export function keepLocalMaxima(lst: List<number>): List<number> {
  return reverseList(keepTrendMiddles(lst, (prev, curr, next) => prev < curr && curr > next));
}

// Take a list of numbers and returns a list of numbers where only the local 
// minima from the original list are included in the same order. A local minimum
// is a number that is preceded and followed in the list by larger numbers.
export function keepLocalMinima(lst: List<number>): List<number> {
  return reverseList(keepTrendMiddles(lst, (prev, curr, next) => prev > curr && curr < next));
}

// Take a list of numbers and returns a list of numbers that includes only 
// the local minima and maxima from the original list, in the same order.
export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return reverseList(keepTrendMiddles(lst, (prev, curr, next) => (
    prev > curr && curr < next) || (prev < curr && curr > next
  )));
}

// Write a function that takes a list of numbers and returns a list of numbers. For 
// each nonnegative number n in the input list, the result list contains the product 
// of the longest contiguous subsequence of nonnegative list elements ending at n.
// Example:
// input: 2 -> 3 -> -1 -> 0.5 -> 2 -> empty
// output: 2 -> 6 -> 0.5 -> 1 -> empty
export function nonNegativeProducts(lst: List<number>): List<number> {
  return condProducts(lst, (el) => el >= 0);
}

// Write a function that takes a list of numbers and returns a list of numbers. For 
// each negative number n in the input list, the result list contains the product 
// of the longest contiguous subsequence of negative list elements ending at n.
// Example:
// input: -3 -> -6 -> 2 -> -2 -> -1 -> -2 -> empty
// output: -3 -> 18 -> -2 -> 2 -> -4 -> empty
export function negativeProducts(lst: List<number>): List<number> {
  return condProducts(lst, (el) => el < 0);
}

export function condProducts(lst: List<number>, addToChainCond: (el: number) => boolean): List<number> {
  return lst.reduce(
    (accumulator, currEl) => {
      let chainProds = accumulator.products;
      let chain = accumulator.currentChain;
      if (addToChainCond(currEl)) {
        chain = node(currEl, chain);
        const chainProd = chain.reduce((prodTotal, el) => prodTotal * el, 1);
        chainProds = node(chainProd, chainProds);
      } else { chain = empty<number>(); }
      return { currentChain: chain, products: chainProds };
    },
    { currentChain: empty<number>(), products: empty<number>() }
  ).products;
}

// Write a function that takes a list of some type T and a value val of type T. The function should 
// return a list with all elements of the given list, in the same order, except the first occurrence 
// of val (if it exists). The result should share as many nodes as possible with the given list.
//
// Hint: You will need to track whether the recursive call returns a shared 
// or new (rebuilt) list. You can directly check the returned reference or 
// use a helper which returns additional information (as a tuple or object).
export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  if (lst.isEmpty()) return lst;
  if (lst.head() == el) return lst.tail(); 
  return node(lst.head(), deleteFirst(lst.tail(), el));
}

// Write a function that takes a list of some type T and a value val of 
// type T. The function should return a list with all elements of the given 
// list, in the same order, except the last occurrence of val (if it exists). 
// The result should share as many nodes as possible with the given list.
export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  return reverseList(deleteFirst(reverseList(lst), el));
}

// Write a function that takes as input a list where each element is either a number or a List<number>. 
// Return a list of numbers where each element that is a list is replaced by the sum of its elements.
export function squashList(lst: List<number | List<number>>): List<number> {
  return lst.reduce(
    (accumulator, currEl) => {
      let squashList = accumulator.squashedList;
      if (typeof currEl == "number") squashList = node(currEl, squashList);
      else {
        const sum = currEl.reduce((total, el) => total + el, 0);
        squashList = node(sum, squashList);
      }
      return { squashedList: squashList };
    },
    { squashedList: empty<number>() }
  ).squashedList;
}