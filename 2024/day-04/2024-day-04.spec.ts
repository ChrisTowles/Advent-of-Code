import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "04"
const PRINT_OUTPUT = false

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

const printResult = (result: ParsedResult) => {
  const padLength = 15
  const printList: any[] = [];

  for (const entry of result.entries) {
    const printObj = {}
    printObj['line'] = entry.line.padEnd(padLength, ' ');
    printList.push(printObj);
  
  }
  
  if(PRINT_OUTPUT) {
    console.table(printList);
  }
}


// -------------------- tests below this -------------------



describe(TITLE, () => {

  test('example: part 1', () => {

    let data = `
    test01
    test02
      `;

    const entry = parseLines(splitByNewLinesAndRemoveEmpty(data))
    printResult(entry)

    expect(entry.entries[0].line).toEqual('test01')

  })



  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries[0].line).toEqual('test01')
    // printResult(entry)
  })


  test('example: part 2', () => {
    let data = `
    test01
    test02
      `;

    const entry = parseLines(splitByNewLinesAndRemoveEmpty(data))
    // printResult(entry)

    expect(entry.entries[0].line).toEqual('test01')

  })



  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries[0].line).toEqual('test01')
    // printResult(entry)
  })


})