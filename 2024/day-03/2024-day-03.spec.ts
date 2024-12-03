import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "03"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {
    result.entries.push({ line })
  }

  return result;
}

const printResult = (result: ParsedResult) => {
  const padLength = 15
  for (let i = 0; i < result.entries.length; i++) {
    console.log(`${i + 1} - line: ${result.entries[i].line.padEnd(padLength, ' ')}`);
  }
}


// -------------------- tests below this -------------------



describe(TITLE, () => {



  let getExampleInput = () => {
    
    let data = `
    test01
    test02
      `;
      
    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('parse lines', () => {
    const entry = parseLines(getExampleInput())

    expect(entry.entries[0].line).toEqual('test01')
    // printResult(entry)

  })



  test('answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries[0].line).toEqual('test01')
    // printResult(entry)
  })


})