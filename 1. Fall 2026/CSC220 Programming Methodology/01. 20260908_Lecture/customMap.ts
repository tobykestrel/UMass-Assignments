/*
Toby Hansen
Sep 08 2026
CSC220 Lec1
*/

// CUSTOM map function, perform a passed function on every item in an array.
function customMap<T>(values: T[], func: (value: T) => T): T[] {
    const result = [];
    for (const val  of values) result.push(func(val));
    return result;
}

// Round to 2 decimals.
function round2Decimals(val: number) {
    return  Number(val.toFixed(2));
}

// Convert miles to KM.
function milesToKm(miles: number) {
    return round2Decimals(miles*1.60934); 
}

// Program test for custom map.
const distancesInMiles = [0.1, 2.3, 4.5, .6];
const distancesInKm = customMap(distancesInMiles, milesToKm);
console.log(`Distances in miles     : ${distancesInMiles}`);
console.log(`Distances in kilometers: ${distancesInKm}`);


/* NOTES:
// - Functions are first class in javascript
// - created at runtime
// - pass them as params
// - assign them to variables
// - return them from functions
*/