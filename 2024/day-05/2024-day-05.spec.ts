import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'
import { createSecretKey } from 'crypto'


// Constants
const YEAR = "2024"
const DAY = "05"
const PRINT_OUTPUT = false

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  dependents: Map<string, Set<string>>,
  updatesEntires: {
    entries: string[]
  }[]

}



const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = {
    dependents: new Map<string, Set<string>>(),
    updatesEntires: []
  };
  // Parse

  let firstPart = true
  for (const line of input) {

    if (line === '') {
      firstPart = false
    }

    if (firstPart) {
      const entry = line.split('|')
      const key = entry[0]
      const value = entry[1]


      if (!result.dependents.has(key)) {
        result.dependents.set(key, new Set());
      }

      result.dependents.get(key)!.add(entry[1])
      // console.log(` key: ${key}  ${value} add`, result.dependents)

    } else {
      const entries = line.split(',')
      if (entries.length > 1) {
        result.updatesEntires.push({ entries: entries })
      }
    }
  }

  // console.log(` dependents: `, result.dependents)
  // parse Done
  return result;
}

const shouldComeBefore = (input: ParsedResult, a: string, b: string): boolean => {
  return input.dependents.get(a)?.has(b) ?? false;
};


const part1 = async (input: ParsedResult): Promise<number> => {

  const isValidUpdate = (update: string[]): boolean => {
    let result = true

    for (let i = 0; i < update.length - 1; i++) {
      if (!shouldComeBefore(input, update[i], update[i + 1])) {
        result = false;
      }
    }

    return result;
  };

  const validResult = input.updatesEntires.filter(x => isValidUpdate(x.entries))

  const VaildResultSum = validResult.reduce(
    (acc, curr) => acc + parseInt(curr.entries[Math.floor(curr.entries.length / 2)]),
    0
  );

  return VaildResultSum
}


const part2 = async (input: ParsedResult): Promise<number> => {


  const isInvalidUpdate = (update: string[]): boolean => {
    for (let i = 0; i < update.length - 1; i++) {
      if (shouldComeBefore(input, update[i + 1], update[i])) {
        return true;
      }
    }

    return false;
  };



  let VaildResultSum = input.updatesEntires
    .filter(x => isInvalidUpdate(x.entries))
    .map((update) => {


      const sortedUpdate = update.entries.sort((a, b) => {
        if (shouldComeBefore(input, b, a)) {
           return 1;
        }
        if (shouldComeBefore(input,a, b)) { 
          return -1;
        }
        return 0;
      });

      return parseInt(sortedUpdate[Math.floor(sortedUpdate.length / 2)]);
    })
    .reduce((acc, curr) => acc + curr, 0);


  return VaildResultSum
}

// -------------------- tests below this -------------------



describe(TITLE, () => {

  let dataPartExample1 = `
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

  test('example: part 1', async () => {



    const result = parseLines(splitByNewLinesAndRemoveEmpty(dataPartExample1))
    const part1Answer = await part1(result)

    expect(part1Answer).toEqual(143)

  })



  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const result = parseLines(testDataRaw)
    const part1Answer = await part1(result)

    expect(part1Answer).toEqual(4569)
  })


  test('example: part 2', async () => {


    const result = parseLines(splitByNewLinesAndRemoveEmpty(dataPartExample1))
    const part1Answer = await part2(result)

    expect(part1Answer).toEqual(123)

  })



  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const result = parseLines(testDataRaw)
    const part2Answer = await part2(result)

    expect(part2Answer).toEqual(6456)
  })


})