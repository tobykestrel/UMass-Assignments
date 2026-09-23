// Exercise 1: Mental Models (see slides and worksheet)

/*
let thing = {
  spam: 42,
  egg: [1, 2]
};

let tmp = thing.egg;
thing.egg[0] += 3;
thing.egg = thing.spam;
thing.spam = tmp;
thing.spam.push(thing.egg);
thing.spam.filter(x => x < 5);
*/

// Exercise 2: Closures
export function factorialSum(): () => number {
  let n = 1;
  let factorial = 1;
  let sum = 0;

  return () => {
    factorial *= n++;
    sum += factorial;
    return sum;
  };
}
