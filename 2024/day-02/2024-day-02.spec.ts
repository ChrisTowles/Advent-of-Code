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
  safe: Boolean
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {

    const entry: ParsedEntry = { line,
      safe: true
     };

   
    // The levels are either all increasing or all decreasing.
    // Any two adjacent levels differ by at least one and at most three.

    const reports = line.split(' ').map(Number)

    const isIncreasing = reports.every((value, index) => {
      if (reports.length === (index  + 1))  { // if at end of array
        return true;
      }

      return reports.length > index + 1 && (value < reports[index + 1])
    })
   
    
    const isDecreasing = reports.every((value, index) => {
      if (reports.length === (index  + 1))  { // if at end of array
        return true;
      }

      return reports.length > index + 1 && (value > reports[index + 1])
     })

    
    
    const maxDif = reports.every((value, index) => {
      if (reports.length === (index  + 1))  { // if at end of array
        return true;
      }
      const diffVal =  Math.abs(value - reports[index + 1])

      if ( diffVal >= 1 && diffVal <= 3) {
        return true;
      } else {
        return false;
      }
    })
     
    entry.safe = (isIncreasing || isDecreasing) && maxDif;


    result.entries.push(entry)
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



  test('answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries.filter(e => e.safe === true)).toHaveLength(2)
    // printResult(entry)
  })


})