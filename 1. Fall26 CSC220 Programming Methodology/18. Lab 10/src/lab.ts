import { completeHunt, searchClueAtLocation } from "../include/scavenger_hunt.js";

// searchClueAtLocation: this function takes in a location name (string) and returns a Promise that either:
// - fulfills (succeeds) with an object { part: "pass", index: 0 } that contains the part of password and its index
// - rejects (fails) and returns an Error object
// Note: the indices are all integers in the range [0, total number of password parts)

// completeHunt: this function takes in your password (string) and checks if it is correct
// if the password is incorrect, or you take too long to figure out the password, the method will fail

const locations = ["LGRT", "CICS Building", "Worcester DC", "ILC", "Rec Center", "DuBois Library", "Campus Pond"];

// ###########################################################################
// TODO: Find the secret message
// ###########################################################################
// Fill up passwordParts with the password segments you receive from `searchClueAtLocation`
const passwordParts = Array(locations.length).fill("");

const promises: Promise<{part: string, index: number}>[] = [];
for (let i = 0; i < locations.length; i++) {
    promises.push(searchClueAtLocation(locations[i]));
}
Promise.allSettled(promises).then( (results) => {
    for (const r of results) {
      if (r.status === "fulfilled") {
        passwordParts[r.value.index] = r.value.part;
        console.log("Found: " + r.value.part);
      } else { console.error("Failed: " + r.reason); }
    }
    const password = passwordParts.join("");
    console.log("Password: " + password);
    completeHunt(password);
}).catch((e) => { console.error(e); });

// ###########################################################################
// #                             END OF YOUR CODE                            #
// ###########################################################################

// Once you've filled up passwordParts, you may find the three lines below helpful
// const password = passwordParts.join("");
// console.log("Password: " + password);
// completeHunt(password);
