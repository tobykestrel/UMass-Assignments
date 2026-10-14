import assert from "assert";

import type { StableMatcherWithTrace } from "../include/stableMatching.js";

export function generateInput(n: number): number[][] {
  const output: number[][] = [];
  for (let i = 0; i < n; i++) {
    const preferences: number[] = [];
    for (let j = 0; j < n; j++) {
      preferences.push(j);
    }
    output.push(preferences);
  }

  for (const preferences of output) {
    for (let j = preferences.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [preferences[j], preferences[k]] = [preferences[k], preferences[j]];
    }
  }
  return output;
}

const NUM_TESTS = 20;
const N = 6;

function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    assert(Array.isArray(trace), "The trace must be an array.");
    assert(Array.isArray(out), "The output matching must be an array.");

    const compMatches = Array<number>(N).fill(-1);
    const candMatches = Array<number>(N).fill(-1);
    const compNextChoice = Array<number>(N).fill(0);
    const candNextChoice = Array<number>(N).fill(0);

    for (const offer of trace) {
      assert(isObject(offer), "Each offer must be an object.");
      assert(typeof offer.fromCo === "boolean", "Each offer must identify the proposing side.");
      assert(Number.isInteger(offer.from) && offer.from >= 0 && offer.from < N, "The proposer must be a valid index.");
      assert(Number.isInteger(offer.to) && offer.to >= 0 && offer.to < N, "The recipient must be a valid index.");

      if (offer.fromCo) {
        const company = offer.from;
        const candidate = offer.to;
        assert(compMatches[company] === -1, "A matched company cannot make an offer.");
        assert(
          compNextChoice[company] < companies[company].length,
          "A company cannot offer after exhausting its preference list."
        );
        assert(
          companies[company][compNextChoice[company]] === candidate,
          "A company must offer to the next candidate on its preference list."
        );
        compNextChoice[company]++;

        const currentCompany = candMatches[candidate];
        if (
          currentCompany === -1 ||
          candidates[candidate].indexOf(company) < candidates[candidate].indexOf(currentCompany)
        ) {
          if (currentCompany !== -1) {
            compMatches[currentCompany] = -1;
          }
          compMatches[company] = candidate;
          candMatches[candidate] = company;
        }
      } else {
        const candidate = offer.from;
        const company = offer.to;
        assert(candMatches[candidate] === -1, "A matched candidate cannot make an offer.");
        assert(
          candNextChoice[candidate] < candidates[candidate].length,
          "A candidate cannot offer after exhausting its preference list."
        );
        assert(
          candidates[candidate][candNextChoice[candidate]] === company,
          "A candidate must offer to the next company on its preference list."
        );
        candNextChoice[candidate]++;

        const currentCandidate = compMatches[company];
        if (
          currentCandidate === -1 ||
          companies[company].indexOf(candidate) < companies[company].indexOf(currentCandidate)
        ) {
          if (currentCandidate !== -1) {
            candMatches[currentCandidate] = -1;
          }
          compMatches[company] = candidate;
          candMatches[candidate] = company;
        }
      }
    }

    const outCompMatches = Array<number>(N).fill(-1);
    const outCandMatches = Array<number>(N).fill(-1);
    for (const hire of out) {
      assert(isObject(hire), "Each hire must be an object.");
      assert(
        Number.isInteger(hire.company) && hire.company >= 0 && hire.company < N,
        "The company index must be valid."
      );
      assert(
        Number.isInteger(hire.candidate) && hire.candidate >= 0 && hire.candidate < N,
        "The candidate index must be valid."
      );
      assert(outCompMatches[hire.company] === -1, "A company cannot have more than one hire.");
      assert(outCandMatches[hire.candidate] === -1, "A candidate cannot have more than one hire.");
      outCompMatches[hire.company] = hire.candidate;
      outCandMatches[hire.candidate] = hire.company;
    }

    for (let party = 0; party < N; party++) {
      assert(outCompMatches[party] === compMatches[party], "The output must reflect the trace's company matches.");
      assert(outCandMatches[party] === candMatches[party], "The output must reflect the trace's candidate matches.");
    }
  }
}
