// CUSTOM map function, perform a passed function on every item in an array.
function distMap<T>(values: T[], func: (value: T) => T): T[] {
    const result = [];
    for (const val  of values) {
        result.push(func(val));
    }
    return result;
}

// Convert miles to KM and round to 2 decimals.
function milesToKm(miles: number) {
    return Number((miles*1.60934).toFixed(2)); 
}

const distancesInMiles = [0.1, 2.3, 4.5, .6];
const distancesInKm = distMap(distancesInMiles, milesToKm);
console.log(`Distances in miles     : ${distancesInMiles}`);
console.log(`Distances in kilometers: ${distancesInKm}`);


// Functions are first class in javascripts
// - created at runtime
// - pass them as params
// - assign them to variables
// - return them from functions