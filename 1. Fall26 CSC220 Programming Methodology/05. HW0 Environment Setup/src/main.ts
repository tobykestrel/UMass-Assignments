import { helloWorld, iAmExcitedFor220, iAmBroken, myFirstFunction } from "./setup.js";

// Before we do anything let's run `npm install`.

// Part 1

/**
 * This is the main file of the application.
 */

console.log("You can see this printed in the console! Very exciting.");

/**
 * We can also run code from other files here. Most of the code you will
 * not be written in main.ts, but rather a separate file. In this case,
 * we'll write code in setup.ts. main.ts can  be used freely by you to execute
 * code written in the actual file.
 *
 * Note that we imported both functions from the setup.ts file on line 1.
 */

// Lets store the result of calling `helloWorld()` in a new variable.

const result = helloWorld();

// The variable `result` now stores the string returned by the `helloWorld()` function.

// Let's print it to the console.
console.log(result);

// Not all functions return a result.

iAmExcitedFor220(false);

iAmExcitedFor220(true);

// Let's run this file now. Type `npm run start` in the command prompt.

// Part 2

/**
 * Now that we know that we can start an application using `npm start`, how do we debug?
 *
 * The function iAmBroken(s: string) is supposed to take a string
 * and return the highest ASCII code for a letter in the string.
 *
 * Unfortunately it returns the lowest! Let's fix that using the debugger.
 */

const brokenResult = iAmBroken("bca"); // 99

console.log(brokenResult);

// Part 3

/**
 * Finally, go into `setup.ts` and implement the solution to `myFirstFunction`.
 *
 * You'll see a description of what to do there. Once you've implemented the solution,
 * Come back to this file and print out the result to calling the function with
 * the parameter 5.
 *
 * Then go into setup.test.ts and learn about testing your code.
 */

const myFirstResult = 5;
console.log(myFirstFunction(myFirstResult));

// Part Three: run `npm run build:submission` and submit to gradescope.

// Done :)
