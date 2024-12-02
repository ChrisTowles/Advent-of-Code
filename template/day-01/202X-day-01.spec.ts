import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'

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

const RAW_DATA_PATH = "template/day-01/202X-day-01.data.txt"

// -------------------- tests below this -------------------



describe('2023 Day 01', () => {



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