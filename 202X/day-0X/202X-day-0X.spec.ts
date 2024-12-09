import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'


// Constants
const YEAR = "202X"
const DAY = "0X"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  value: string;
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {
    const parsedEntry: ParsedEntry = { 
      line: line,
      value: ''
     };

    result.entries.push(parsedEntry)
  }

  return result;
}

const solvePart1 = async(input: ParsedResult): Promise<Number> => {

  return 0;
}


const solvePart2 = async(input: ParsedResult): Promise<Number> => {

  return 0;
}

// -------------------- tests below this -------------------

describe(TITLE, () => {

  let exampleDataPart1 = `
  test01
  test02
    `;

  test('example: part 1', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart1(entry)
    expect(answer).toEqual(0)
  })

  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    const answer = await solvePart1(entry)
    expect(answer).toEqual(0)

  })

  test('example: part 2', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart2(entry)
    expect(answer).toEqual(0)
  })

  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = parseLines(testDataRaw)
    const answer = await solvePart2(entry)
    expect(answer).toEqual(0) 
  })

})