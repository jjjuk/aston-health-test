import { differenceWith, fromPairs, isEqual, toPairs } from 'lodash'

export const objectDiff = (a, b) =>
  fromPairs(differenceWith(toPairs(a), toPairs(b), isEqual))
