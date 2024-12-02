import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'


// Constants
const YEAR = "2023"
const DAY = "02"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  gameNumber: number
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {
    result.entries.push({ line, gameNumber: parseInt(line.split(' ')[1].replace(':', '')) })
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
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
      `;
      
    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('parse lines', () => {
    const entry = parseLines(getExampleInput())

    expect(entry.entries[0].line).toEqual('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green')
    printResult(entry)

  })



  test('answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    expect(entry.entries[0].line.startsWith('Game 1: 1 green, 1 blue, 1 red; ')).toBeTruthy()
  })


})