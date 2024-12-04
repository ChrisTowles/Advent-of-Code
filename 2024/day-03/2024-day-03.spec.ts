import { describe, expect, test } from 'vitest'
import { readFile, readFileByLines } from '../../utils/read-file'

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
  muls: string[];
  mulsValue: number[];
  mulsValuePart2: number[];
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };


  for (const line of input) {
    const parsedEntry: ParsedEntry = {
      line: line,
      muls: [],
      mulsValue: [],
      mulsValuePart2: []
    };
    const regexMul = /mul\(([0-9]+),([0-9]+)\)/g
    parsedEntry.mulsValue = parseForValue(line, regexMul)

    // part 2

    const resultOfDont = splitKeepDelimiter(`do\(\)${line}`, 'don\'t\(\)');
    const resultOfDontAndDo = resultOfDont.map(x => {
      return splitKeepDelimiter(x, 'do\(\)');
    }).flatMap(x => x);



    resultOfDontAndDo.filter(x => x.startsWith('do\(\)')).forEach((x, index) => {
      const values = parseForValue(x, regexMul);
      // console.log(x);

      values.forEach((value, index) => { parsedEntry.mulsValuePart2.push(value) });
    })

    result.entries.push(parsedEntry)
  }

  return result;
}

function parseForValue(line: string, regexMul: RegExp) {

  const mulsValue: number[] = []
  const matches = line.matchAll(regexMul)
  for (const match of matches) {
    mulsValue.push(Number(match[1]) * Number(match[2]))
  }

  return mulsValue;
}

function splitKeepDelimiter(str: string, delimiter: string): string[] {
  return str.split(delimiter).map((x, index) => {
    if (index === 0) {
      return x;
    } else {
      return `${delimiter}${x}`;
    }
  });
}

const printResult = (result: ParsedResult) => {
  const padLength = 15


  const printList: any[] = [];

  for (const entry of result.entries) {
    const printObj = {}
    // printObj['line'] = entry.line.padEnd(padLength, ' ');
    printObj['muls'] = entry.muls.join('|')
    printObj['mulsValue'] = entry.mulsValue.join('|')
    printList.push(printObj);

  }
  console.table(printList);
}


// -------------------- tests below this -------------------



describe(TITLE, () => {



  let getExampleInput = () => {

    let data = `
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
      `;

    return data.split('\n').map(line => line.trim()).filter(line => line !== '');
  }



  test('parse lines', () => {
    const entry = parseLines(getExampleInput())

    // printResult(entry)
    // expect(entry.entries[0].line).toEqual('test01')
    expect(entry.entries[0].mulsValue.reduce((acc, curr) => acc + curr, 0)).toEqual(161);


  })



  test('answer: part 1', async () => {
    const testDataRaw = await readFile(RAW_DATA_PATH)

    const entry = parseLines([testDataRaw])
    expect(entry.entries[0].mulsValue.reduce((acc, curr) => acc + curr, 0)).toEqual(161289189);

  })




  test('parse lines - example part 2', () => {
    const entry = parseLines(["xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"])

    // printResult(entry)


    // expect(entry.entries[0].line).toEqual('test01')
    expect(entry.entries[0].mulsValuePart2.reduce((acc, curr) => acc + curr, 0)).toEqual(48);


  })




  test('answer: part 2', async () => {
    const testDataRaw = await readFile(RAW_DATA_PATH)

    const entry = parseLines([testDataRaw])

    // printResult(entry)
    expect(entry.entries[0].mulsValuePart2.reduce((acc, curr) => acc + curr, 0)).toEqual(83595109);

  })
})