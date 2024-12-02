// sum.test.js
import { beforeAll, describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'

// Constants
const YEAR = "2024"
const DAY = "01"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


//https://adventofcode.com/2024/day/1


// Note: i worked two hard on this one, i overly complicated the lists thinking i had to split each number treating each number as a single digit number.....
// So there's a way more tests than needed because I couldn't figure out what i has "doing wrong"! The fun of over thinking!

interface ParsedEntry {
  left_list: number[];
  right_list: number[];
}

const parseLines = (input: string[]): ParsedEntry => {

  let result: ParsedEntry = {
    left_list: [],
    right_list: []
  };

  for (const line of input) {
    const split_list = line.split(' ').filter(line => line !== '');
    result.left_list.push(Number(split_list[0]));
    result.right_list.push(Number(split_list[1]));
  }

  return result;
}


const sortLEntry = (input: ParsedEntry): ParsedEntry => {
  return {
    left_list: input.left_list.sort(),
    right_list: input.right_list.sort()
  };
}

interface DiffLine {
  diff_list: number[];
  sum: number;
}

const calculateDiff = (input: ParsedEntry): DiffLine => {

  if (input.left_list.length !== input.right_list.length) {
    throw new Error('Lists are not of equal length')
  }
  const result: DiffLine = {
    diff_list: [],
    sum: 0
  };

  for (let i = 0; i < input.left_list.length; i++) {
    const diff = Math.abs(input.left_list[i] - input.right_list[i])
    result.diff_list.push(diff)
    result.sum += diff
  }

  return result;
}

interface SimilarityResult {
  similarity_scores: number[];
  sum: number;
}

const similarScore = (input: ParsedEntry): SimilarityResult => {

  if (input.left_list.length !== input.right_list.length) {
    throw new Error('Lists are not of equal length')
  }
  const result: SimilarityResult = {
    similarity_scores: [],
    sum: 0
  };

  // console.log(`list: ${input.left_list.join(',')} `);

  for (let i = 0; i < input.left_list.length; i++) {
    const selectedNum = input.left_list[i];
    const matchesFound = input.right_list.filter(x => x === selectedNum).length
    const similarityScore = selectedNum * matchesFound
    // console.log(` ${selectedNum} ${matchesFound} = ${similarityScore}`)
    result.similarity_scores.push(similarityScore)
    result.sum += similarityScore
  }

  return result;
}

// -------------------- tests below this -------------------

describe('2024 Day 01', () => {

  let exampleInput = '';
  exampleInput += "3   4\n";
  exampleInput += "4   3\n"
  exampleInput += "2   5\n"
  exampleInput += "1   3\n"
  exampleInput += "3   9\n"
  exampleInput += "3   3\n"


  test('parse line single', () => {
    const input = ['71764   99003']
    const entry = parseLines(input)
    expect(entry.left_list.length).toEqual(1)

    expect(entry.right_list.length).toEqual(1)
    expect(entry.left_list).toEqual([71764])
    expect(entry.right_list).toEqual([99003])
  })


  test('parse line multi', () => {
    const input = ['71764   99003', '12345   15421']
    const entry = parseLines(input)
    expect(entry.left_list.length).toEqual(2)

    expect(entry.right_list.length).toEqual(2)
    expect(entry.left_list).toEqual([71764, 12345])
    expect(entry.right_list).toEqual([99003, 15421])

  })

  test('parse line sorted and diff - v1', () => {
    const input = ['71764   99003', '12345   15421']
    const entry = parseLines(input)
    const sortedEntry = sortLEntry(entry);
    const diff = calculateDiff(sortedEntry);
    expect(diff.diff_list).toEqual([3076, 27239])
    expect(diff.sum).toEqual(30315)
  })


  test('parse line', () => {
    const inputSplit = exampleInput.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    expect(entry.left_list.length).toEqual(6)
    expect(entry.right_list.length).toEqual(6)
    expect(entry.left_list).toEqual([3, 4, 2, 1, 3, 3])
    expect(entry.right_list).toEqual([4, 3, 5, 3, 9, 3])
  })

  test('parse line sorted', () => {
    const inputSplit = exampleInput.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    const sortedEntry = sortLEntry(entry);
    expect(sortedEntry.left_list.length).toEqual(6)
    expect(sortedEntry.right_list.length).toEqual(6)
    expect(sortedEntry.left_list).toEqual([1, 2, 3, 3, 3, 4])
    expect(sortedEntry.right_list).toEqual([3, 3, 3, 4, 5, 9])
  })

  test('parse line sorted and diff', () => {
    const inputSplit = exampleInput.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    const sortedEntry = sortLEntry(entry);
    const diffEntry = calculateDiff(sortedEntry);
    expect(diffEntry.diff_list.length).toEqual(6)
    expect(diffEntry.diff_list).toEqual([2, 1, 0, 1, 2, 5])
    expect(diffEntry.sum).toEqual(11)
  })

  test('part 1 - answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const diffEntries: DiffLine[] = [];
    const ParsedEntry = parseLines(testDataRaw)
    const sortedLine = sortLEntry(ParsedEntry)
    const diff = calculateDiff(sortedLine);
    diffEntries.push(diff);
    console.log('2024 Day One total sum:', diff.sum)
  })

  test('part 2 - example', () => {
    const inputSplit = exampleInput.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    const similarResult = similarScore(entry);

    // similar score
    expect(similarResult.similarity_scores.length).toEqual(6)
    expect(similarResult.similarity_scores).toEqual([9, 4, 0, 0, 9, 9])
    expect(similarResult.sum).toEqual(31)

  })

  test('part 2 - answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = parseLines(testDataRaw)
    const similarResult = similarScore(entry);

    // similar score
    console.log(`Day 1 part 2 answer: ${similarResult.sum}`)
  })
})