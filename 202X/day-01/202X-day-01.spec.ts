import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'


// Constants
const YEAR = "202X"
const DAY = "01"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedEntry {
  line: string[];
}

const parseLines = (input: string[]): ParsedEntry => {

  let result: ParsedEntry = {
    line: [],
  };

  for (const line of input) {
    result.line.push(line);
  }

  return result;
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

    expect(entry.line[0]).toEqual('test01')

  })



  test('answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.line[0]).toEqual('test01')
  })

})