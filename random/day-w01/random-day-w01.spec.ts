import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'
import { parse } from 'path'
import { parseRegexp } from 'vitest/utils.js'


// Constants
const YEAR = "random"
const DAY = "w01"
const PRINT_OUTPUT = false

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  entires: number[];
  note: string;
  valid: boolean;
  a: boolean,
  b: boolean,

  c: boolean,

  d: boolean,

  e: boolean,
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {

    const parsedEntry: ParsedEntry = { 
      entires: [],
      note: '',
      valid: false,
      a: false,
      b: false,
      c: false,
       d: false,
      e: false,
    };


    parsedEntry.entires = line.split('').map(Number)

    // `9285` - one digit is correct but wrongly placed
    const a = [9,2,8,5]
    const aTest = [
      [2,8,5].includes(parsedEntry.entires[0]),
      [9,8,5].includes(parsedEntry.entires[1]),
      [9,2,5].includes(parsedEntry.entires[2]),
      [9,2,8].includes(parsedEntry.entires[3])
    ]


    const aTestResult = aTest.filter(x => x === true).length
    if( aTestResult) {
      parsedEntry.a = true
    }

    // 1937 - two digests are correct but wrong placed
    const b = [1,9,3,7]
    const bTest = [
      [9,3,7].includes(parsedEntry.entires[0]),
      [1,3,7].includes(parsedEntry.entires[1]),
      [1,9,7].includes(parsedEntry.entires[2]),
      [1,9,3].includes(parsedEntry.entires[3])
    ] 
    const bTestResult = bTest.filter(x => x).length
    if( bTestResult == 2 ) {
      // parsedEntry.note += 'b'
      parsedEntry.b = true
    }


    // 5201 - one digit is correct are well placed
    const c = [5,2,0,1]
    const cTest = [
      [5].includes(parsedEntry.entires[0]),
      [2].includes(parsedEntry.entires[1]),
      [0].includes(parsedEntry.entires[2]),
      [1].includes(parsedEntry.entires[3])
    ]
    const cTestResult = cTest.filter(x => x).length 

    if( cTestResult === 1 ) {
      parsedEntry.c = true
    }

    // 6507 - nothing is correct
    const d = [6,5,0,7]
    const dValues = [ ...new Set(parsedEntry.entires.concat(d) )];

    if( dValues.length === 8 ) {
      parsedEntry.d = true
    }
    
    // 8524 - two digits are correct but wrong placed
    const eTest = [
      [5,2,4].includes(parsedEntry.entires[0]),
      [8,2,4].includes(parsedEntry.entires[1]),
      [8,5,4].includes(parsedEntry.entires[2]),
      [8,5,2].includes(parsedEntry.entires[3])
    ] 

    const eTestResult = eTest.filter(x => x).length 
    if( eTestResult === 2 ) {
      parsedEntry.valid = true
      // parsedEntry.note += 'e'
      parsedEntry.e = true
    }

    parsedEntry.valid = parsedEntry.a && parsedEntry.b && parsedEntry.c && parsedEntry.d && parsedEntry.e

    result.entries.push(parsedEntry)
  }

  return result;
}

const printResult = (result: ParsedResult) => {
  const printList: any[] = [];

  for (const entry of result.entries) {
    const printObj = {}
    printObj['line'] = entry.entires.join(',')
    printObj['valid'] = entry.valid
    printObj['note'] = entry.note
    printObj['a'] = entry.a
    printObj['b'] = entry.b
    printObj['c'] = entry.c
    printObj['d'] = entry.d
    printObj['e'] = entry.e
    printList.push(printObj);
  }

  if(PRINT_OUTPUT) {
    console.table(printList);
    console.log(`validCount:`, result.entries.length)
  }
}

function generateCombinations(): string[] {
  const combinations: string[] = [];

  for (let i = 0; i <= 9999; i++) {
    const combination = i.toString().padStart(4, '0');
    const uniqueEntries = [...new Set(combination.split('').map(Number))];
    if( uniqueEntries.length === 4) {
      combinations.push(combination);
    }
  }
 
  return combinations;
}

// -------------------- tests below this -------------------
describe(TITLE, () => {

  test('parse lines', () => {

    const allCombinations = generateCombinations();
    const entry = parseLines(allCombinations)

    entry.entries = entry.entries.filter(x => x.valid)
    printResult(entry)



  })

})








