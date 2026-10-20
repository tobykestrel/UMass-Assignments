import type { Business } from "../include/data";

export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T]> {
  const itr = iterable[Symbol.iterator]();
  let previous = itr.next();
  while (!previous.done) {
    const current = itr.next();
    if (current.done) return;
    yield [previous.value, current.value];
    previous = current;
  }
  return;
}

export function* cycle<T>(iterables: Iterable<T>[]): Generator<T> {
  const itrs: Iterator<T>[] = iterables.map(iterable => iterable[Symbol.iterator]());
  while (itrs.length > 0) {
    for (let i = 0; i < itrs.length; i++) {
      const val = itrs[i].next();
      if (val.done) {
        itrs.splice(i, 1);
        i--;
      } else yield val.value;
    }
  }
  return;
}

type FilterFunc = (business: Business) => boolean;

// Declare the BusinessQuery class here.
// Start the declaration with "export class" so that
// it can be imported from other modules.
export class BusinessQuery implements Iterable<Business> {
  private bizItr: Iterable<Business>;
  constructor(itr: Iterable<Business>) {
    this.bizItr = itr;
  }

  [Symbol.iterator](): Iterator<Business> {
    return this.bizItr[Symbol.iterator]();
  }

  filter(func: FilterFunc): BusinessQuery {
    const source = this.bizItr;
    const filtered: Iterable<Business> = {
      *[Symbol.iterator]() {
        for (const biz of source) if (func(biz)) yield biz;
      },
    };
    return new BusinessQuery(filtered);
  }

  exclude(func: FilterFunc): BusinessQuery {
    const source = this.bizItr;
    const excluded: Iterable<Business> = {
      *[Symbol.iterator]() {
        for (const biz of source) if (!func(biz)) yield biz;
      },
    };
    return new BusinessQuery(excluded);
  }

  slice(start: number, end?: number): BusinessQuery {
    if (!Number.isInteger(start) || (end !== undefined && !Number.isInteger(end))) {
      throw new SliceError("slice: start and end must be integers");
    }
    const sliceEnd = end === undefined ? Infinity : end;
    if (start < 0 || sliceEnd < 0) {
      throw new SliceError("slice: start and end must be non-negative");
    }
    if (start > sliceEnd) {
      throw new SliceError("slice: start must not be greater than end");
    }

    const source = this.bizItr;
    const sliced: Iterable<Business> = {
      *[Symbol.iterator]() {
        let index = 0;
        for (const biz of source) {
          if (index >= start && index < sliceEnd) yield biz;
          index++;
          if (index >= sliceEnd) break;
        }
      },
    };
    return new BusinessQuery(sliced);
  }
}

export class SliceError extends Error {}
