import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'
import { createSecretKey } from 'crypto'


// Constants
const YEAR = "2024"
const DAY = "05"
const PRINT_OUTPUT = true

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  pagedOrdering:
  Record<string, number[]>
  ,
  updatesEntires: [{
    entries: number[]
    hadMissingLineIndex: number[]
  }
  ]

}



const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = {
    pagedOrdering: {},
    updatesEntires: [{
      entries: [],
      hadMissingLineIndex: []
    }]

  };
  // Parse

  let firstPart = true
  for (const line of input) {

    if (line === '') {
      firstPart = false
    }

    if (firstPart) {
      const entry = line.split('|').map(Number)
      const key = entry[0].toString()
      if (result.pagedOrdering[key]) {
        result.pagedOrdering[key].push(entry[1])

      } else {
        result.pagedOrdering[key] = [entry[1]]
      }
    } else {
      const entries = line.split(',').map(Number)
      result.updatesEntires.push({ entries: entries })
    }
  }


  // parse Done

  const keys = Object.keys(result.pagedOrdering)

  // follow the rules
  for (let j = 0; j < result.updatesEntires.length; j++) {

    const p = result.updatesEntires[j]


    for (let x = 0; x < p.entries.length; x++) {

      let current = p.entries[x];
      let remaining = [...p.entries].slice(x, p.entries.length )

      if (keys.includes(current.toString())) {
        const val = result.pagedOrdering[current.toString()]
      }


      console.log(`updates: ${j} - key: ${current.toString()} - x: ${x} - remaining: ${remaining} - p.entries ${p.entries}`)

      
    }
  }


  return result;
}

// const printResult = (result: ParsedResult) => {
//   const padLength = 15
//   const printList: any[] = [];

//   for (const entry of result.entries) {
//     const printObj = {}
//     printObj['line'] = entry.line.padEnd(padLength, ' ');
//     printList.push(printObj);

//   }

//   if(PRINT_OUTPUT) {
//     console.table(printList);
//   }
// }


// -------------------- tests below this -------------------



describe(TITLE, () => {

  test('example: part 1', () => {

    let data = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
      `;

    const entry = parseLines(splitByNewLinesAndRemoveEmpty(data))
    // console.log(JSON.stringify(entry, null, 2))

    // expect(entry.entries[0].line).toEqual('47|53')

  })



  // test('answer: part 1', async () => {
  //   const testDataRaw = await readFileByLines(RAW_DATA_PATH)

  //   const entry = parseLines(testDataRaw)
  //   expect(entry.entries[0].line).toEqual('test01')
  //   // printResult(entry)
  // })


  // test('example: part 2', () => {
  //   let data = `
  //   test01
  //   test02
  //     `;

  //   const entry = parseLines(splitByNewLinesAndRemoveEmpty(data))
  //   // printResult(entry)

  //   expect(entry.entries[0].line).toEqual('test01')

  // })



  // test('answer: part 2', async () => {
  //   const testDataRaw = await readFileByLines(RAW_DATA_PATH)

  //   const entry = parseLines(testDataRaw)
  //   expect(entry.entries[0].line).toEqual('test01')
  //   // printResult(entry)
  // })


})