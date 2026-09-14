export function helloWorld(): string {
  return "Welcome to CS220!";
}

export function iAmExcitedFor220(amI: boolean): void {
  const str = amI ? "Great, we are excited too!" : "Oh no, will change that!";

  console.log(str);
}

export function iAmBroken(s: string): number {
  let highest = s.charCodeAt(0);

  // You'll learn not to use a for loop soon!
  for (let i = 0; i < s.length; ++i) {
    const current = s.charCodeAt(i);
    if (current > highest) {
      highest = current;
    }
  }

  return highest;
}

/**
 * Welcome to your first function in 220!
 *
 * Your function should take a number as input and return
 * false if the number is non-negative or odd, true otherwise.
 *
 * @param input A number
 */
export function myFirstFunction(input: number): boolean {
  return !(input >= 0 || input % 2 !== 0);
}
