import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "02"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  safe: Boolean;
  safePart2: Boolean;
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };


  for (const line of input) {

    const entry: ParsedEntry = {
      line,
      safe: false,
      safePart2: false,
    };


    // The levels are either all increasing or all decreasing.
    // Any two adjacent levels differ by at least one and at most three.

    const reports = line.split(' ').map(Number)


    entry.safe = checkIfListIsSafe(reports)
    if (entry.safe) {
      entry.safePart2 = true
    } else {

      // part 2 logic

      const part2SafeList: boolean[] = []
      for ( let i = 0; i < reports.length; i++) {
      
        const copy = [...reports];
        copy.splice(i, 1)
        // take one out. 
        part2SafeList.push(checkIfListIsSafe(copy))

      }
      entry.safePart2 = part2SafeList.some(safe => safe)
    }
    result.entries.push(entry)
   
  }

  return result;
}

function checkIfListIsSafe(reports: number[]): boolean {
  const isIncreasing = reports.every((value, index) => {
    if (reports.length === (index + 1)) { // if at end of array
      return true
    }

    return reports.length > index + 1 && (value < reports[index + 1])
  })


  const isDecreasing = reports.every((value, index) => {
    if (reports.length === (index + 1)) { // if at end of array
      return true
    }

    return reports.length > index + 1 && (value > reports[index + 1])
  })



  const maxDif = reports.every((value, index) => {
    if (reports.length === (index + 1)) { // if at end of array
      return true
    }
    const diffVal = Math.abs(value - reports[index + 1])

    if (diffVal >= 1 && diffVal <= 3) {
      return true
    } else {
      return false
    }
  })
  return (isIncreasing || isDecreasing) && maxDif;
}


// -------------------- tests below this -------------------



describe(TITLE, () => {



  let getExampleInput = () => {

    let data = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
      `;

    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('parse lines', () => {
    const entry = parseLines(getExampleInput())

    expect(entry.entries[0].line).toEqual('7 6 4 2 1')

    expect(entry.entries.filter(e => e.safe === true)).toHaveLength(2)
    // printResult(entry)

  })



  test('answer part-1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries.filter(e => e.safe === true)).toHaveLength(252)

  })


  test('test part-2', async () => {
    const entry = parseLines(getExampleInput())
    expect(entry.entries.filter(e => e.safePart2 === true)).toHaveLength(4)

  })


  test('answer part-2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries.filter(e => e.safePart2 === true)).toHaveLength(324)

  })


})
