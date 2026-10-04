import { List, listToArray, arrayToList } from "../include/lists.js";

// In Class Exercises

// Exercise 1: Lists
export function merge(l1: List<number>, l2: List<number>): List<number> {
  // TODO: complete this function
  const arr1 = listToArray(l1);
  const arr2 = listToArray(l2);
  let firstList = arr1;
  let secondList = arr2;

  // account for empty lists
  if (arr1.length < 1) {
    if (arr2.length < 1) return arrayToList([]);
    firstList = arr2;
    secondList = arr1;
  }

  // sort the main list
  const sortedFirstList = [firstList[0]];
  for (let i = 1; i < firstList.length; i++) {
    for (let j = 0; j < sortedFirstList.length; j++) {
      if (firstList[i] < sortedFirstList[j]) {
        sortedFirstList.splice(j, 0, firstList[i]);
        break;
      } else if (j === sortedFirstList.length - 1) {
        sortedFirstList.push(firstList[i]);
        break;
      }
    }
  }

  // splice the second list into the main list (if applicable)
  for (let i = 0; i < secondList.length; i++) {
    for (let j = 0; j < sortedFirstList.length; j++) {
      if (secondList[i] <= sortedFirstList[j]) {
        sortedFirstList.splice(j, 0, secondList[i]);
        break;
      } else if (j === sortedFirstList.length - 1) {
        sortedFirstList.push(secondList[i]);
        break;
      }
    }
  }

  return arrayToList(sortedFirstList);
}

// Exercise 2: Closures

// Please complete the closures exercise on Gradescope!
