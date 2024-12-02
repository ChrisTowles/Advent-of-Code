// sum.test.js
import { beforeAll, describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'

//https://adventofcode.com/2023/day/1

// template of day test


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

const RAW_DATA_PATH = "2023/day-01/2023-day-01.data.txt"

// -------------------- tests below this -------------------



describe('2023 Day 01', () => {



  let getExampleInput = () => {
    
    let data = `
      1abc2
      pqr3stu8vwx
      a1b2c3d4e5f
      treb7uchet
      `
      
    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('parse lines', () => {
    const entry = parseLines(getExampleInput())

    expect(entry.line[0]).toEqual('1abc2')

  })



  test('answer', async () => {

    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.line[0]).toEqual('ckmb52fldxkseven3fkjgcbzmnr7')
  })

})