// sum.test.js
import { beforeAll, describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'

// Constants
const YEAR = "2023"
const DAY = "01"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`

// -------------- Logic ----------------------
interface ParsedEntry {
  line: string[];
  part2Lines: string[];
  cleanedUpLines: string[];
  digits: number[];
  sum: number
}

const parseLines = ({ input, part2Enabled }: { input: string[], part2Enabled?: boolean }): ParsedEntry => {

  let result: ParsedEntry = {
    line: [],
    part2Lines: [],
    cleanedUpLines: [],
    digits: [],
    sum: 0
  };

  for (let line of input) {


    result.line.push(line);
    let cleanedUpLine = line

    if (part2Enabled) {
      cleanedUpLine = replaceNumberWordsWithTheirNumbers(line);
      result.part2Lines.push(cleanedUpLine);
    }
    
    const digits = cleanedUpLine.replace(/[^0-9.]/g, '');

    result.cleanedUpLines.push(digits);

    // we have a first and last number
    const firstNumber = digits[0];
    const lastNumber = digits[digits.length - 1];
    const score = Number(`${firstNumber}${lastNumber}`);
    result.digits.push(score);
    result.sum += score;


  }


  return result;

}

type NumberWord = [name: string, value: number];

const ListOfNumbers: NumberWord[] = [
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9]
];


const replaceNumberWordsWithTheirNumbers = (line: string) => {
  let remainingLine: string = line;
  let confirmedLine = ''
  let pos = 0;

  while (remainingLine.length > 0) {

   //  console.log(`remainingLine ${remainingLine}`)

    ListOfNumbers.forEach(([word, value]) => {
      if (remainingLine.startsWith(word)) {
          // My issue was here, i took away the word but end letters were needed to make the other words.
        // remainingLine = remainingLine.replace(new RegExp(`^(${word})`), value.toString());
        confirmedLine += value.toString();
       
      //   console.log('replaced', word, 'with', value)
        
      } 

    })
    pos++;
    confirmedLine += remainingLine.substring(0, 1);
    remainingLine = remainingLine.substring(1, remainingLine.length);
    // console.log(`confirmedLine:  ${confirmedLine}  - remainingLine ${remainingLine}`)
    
  }


  return confirmedLine;
}

const printResult = (result: ParsedEntry) => {
  const padLength = 30
  for (let i = 0; i < result.line.length; i++) {
    console.log(`${i + 1} - line: ${result.line[i].padEnd(padLength, ' ')} part2: ${result.part2Lines[i].padEnd(padLength, ' ')} cleanedUp: ${result.cleanedUpLines[i].padEnd(padLength, ' ')}  digits: ${result.digits[i]} sum: ${result.sum}`);
  }
}


// -------------------- tests below this -------------------

describe(TITLE, () => {



  let getExampleInput = () => {

    let data = `
      1abc2
      pqr3stu8vwx
      a1b2c3d4e5f
      treb7uchet
      `

    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('example parse lines - part1', () => {
    const entry = parseLines({ input: getExampleInput() })

    expect(entry.line[0]).toEqual('1abc2')
    expect(entry.line[1]).toEqual('pqr3stu8vwx')

    expect(entry.line[2]).toEqual('a1b2c3d4e5f')

    expect(entry.line[3]).toEqual('treb7uchet')

    expect(entry.digits[0]).toEqual(12)
    expect(entry.digits[1]).toEqual(38)
    expect(entry.digits[2]).toEqual(15)
    expect(entry.digits[3]).toEqual(77)


    expect(entry.sum).toEqual(142)
  })


  test('example parse lines - part1', () => {

    let getExampleInputPart2 = () => {

      let data = `
          two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen
        `

      return data.split('\n').map(line => line.trim()).filter(line => line !== '');
    }

    const entry = parseLines({ input: getExampleInputPart2(), part2Enabled: true })

    expect(entry.digits).toEqual([29, 83, 13, 24, 42, 14, 76])
    expect(entry.sum).toEqual(281)
    // printResult(entry);
  })




  test('answer - part 1', async () => {

    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines({ input: testDataRaw })
    console.log(`${TITLE} result part 1: ${entry.sum}`);
  })

  test('replace number works', () => {
    let line = "onebtwo"
    const result = replaceNumberWordsWithTheirNumbers(line)
    expect(result).toEqual("1oneb2two")
  });


  test('answer - part 2', async () => {

    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines({ input: testDataRaw, part2Enabled: true })
    console.log(`${TITLE} result part 2: ${entry.sum}`);
    // printResult(entry);
  })

})