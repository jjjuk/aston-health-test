import { matchSorter } from 'match-sorter'

export default function fuzzySearch(rows, keys, filterValue) {
  if (!filterValue || !filterValue.length) {
    return rows
  }
  const terms = filterValue.split(' ')
  if (!terms) {
    return rows
  }
  return terms.reduceRight(
    (results, term) => matchSorter(results, term, { keys }),
    rows
  )
}
