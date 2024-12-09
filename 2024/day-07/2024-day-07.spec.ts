import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "07"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  target: number;
  numbers: number[]
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };


  for (const line of input) {
    const [t, ...n] = line.split(" ");
    
    const parsedEntry: ParsedEntry = {
      line: line,
      target: parseInt(t.slice(0, -1)),
      numbers: n.map(Number)
    };

    result.entries.push(parsedEntry)
  }

  return result;
}
// Helper function to check if a result can be produced with the given operators and numbers
function loopToProduceResult(testResult: number,operators: Array<(left: number, right: number) => number>, ...[left, right, ...rest]: number[]): boolean {
  return operators.some(operator => {
    let result = operator(left, right);
    if (rest.length === 0) {
      // made it to the end. 
      return result === testResult;
    }
    // loop over
    return loopToProduceResult(testResult, operators,  result, ...rest);
  });
}


// 
function calculateResult(input: ParsedResult, operators: Array<(left: number, right: number) => number>) {

  return input.entries
    .filter((x) => loopToProduceResult(x.target, operators,  ...x.numbers))
    .map(x => x.target)
    .reduce((acc, curr) => acc + curr, 0);
}



const solvePart1 =  async (input: ParsedResult): Promise<number> => {
  return calculateResult(input, [
    (left, right) => left + right,
    (left, right) => left * right,
  ]);
}



const solvePart2 =  async (input: ParsedResult): Promise<number> => {
  return calculateResult(input, [
    (left, right) => left + right,
    (left, right) => left * right,
    (left, right) => Number(String(left) + String(right)),
  ]);
}


// -------------------- tests below this -------------------

describe(TITLE, () => {

  let exampleDataPart1 = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
    `;

  test('example: part 1', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart1(entry)
    expect(answer).toEqual(3749)
  })

  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = parseLines(testDataRaw)
    const answer = await solvePart1(entry)
    expect(answer).toEqual(1298103531759)
  })

  test('example: part 2', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart2(entry)
    expect(answer).toEqual(11387)
  })

  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = parseLines(testDataRaw)
    const answer = await solvePart2(entry)
    expect(answer).toEqual(140575048428831)


  })

})