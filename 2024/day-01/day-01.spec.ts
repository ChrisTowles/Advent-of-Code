// sum.test.js
import { beforeAll, describe, expect, test } from 'vitest'
import { readFileByLines } from '../utils/read-file'

//https://adventofcode.com/2024/day/1

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

  if(input.left_list.length !== input.right_list.length) {
    throw new Error('Lists are not of equal length')
  }
  const result: DiffLine = {
    diff_list: [],
    sum: 0
  };

  for (let i = 0; i < input.left_list.length; i++) {
    const  diff = Math.abs( input.left_list[i] - input.right_list[i] )
    result.diff_list.push(diff)
    result.sum += diff
  }

  return result;
}

describe('2024 day 01"', () => {

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
  
  test('parse line multi and shorted  and diff', () => {
    const input = ['71764   99003', '12345   15421']
    const entry = parseLines(input)
    expect(entry.left_list.length).toEqual(2)
    expect(entry.right_list.length).toEqual(2)
    expect(entry.left_list).toEqual([71764, 12345])
    expect(entry.right_list).toEqual([99003, 15421])




    const sortedEntry = sortLEntry(entry);

    expect(sortedEntry.left_list.length).toEqual(2)
    expect(sortedEntry.right_list.length).toEqual(2)
    expect(sortedEntry.left_list).toEqual([12345, 71764])
    expect(sortedEntry.right_list).toEqual([15421, 99003 ])
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
    
    let input = '';
    input += "3   4\n";
    input += "4   3\n"
    input += "2   5\n"
    input += "1   3\n"
    input += "3   9\n"
    input += "3   3\n"
    

    const inputSplit = input.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    expect(entry.left_list.length).toEqual(6)
    expect(entry.right_list.length).toEqual(6)
    expect(entry.left_list).toEqual([3,4,2,1,3,3])
    expect(entry.right_list).toEqual([4,3,5,3,9,3])


  })


  test('parse line sorted', () => {
    
    let input = '';
    input += "3   4\n";
    input += "4   3\n"
    input += "2   5\n"
    input += "1   3\n"
    input += "3   9\n"
    input += "3   3\n"
    

    const inputSplit = input.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    const sortedEntry = sortLEntry(entry);
    expect(sortedEntry.left_list.length).toEqual(6)
    expect(sortedEntry.right_list.length).toEqual(6)
    expect(sortedEntry.left_list).toEqual([1,2,3,3,3,4])
    expect(sortedEntry.right_list).toEqual([3,3,3,4,5,9])


  })

  test('parse line sorted and diff', () => {
    
    let input = '';
    input += "3   4\n";
    input += "4   3\n"
    input += "2   5\n"
    input += "1   3\n"
    input += "3   9\n"
    input += "3   3\n"
    

    const inputSplit = input.split('\n').filter((line: string) => line !== '')
    const entry = parseLines(inputSplit)
    const sortedEntry = sortLEntry(entry);
    const diffEntry = calculateDiff(sortedEntry);
    expect(diffEntry.diff_list.length).toEqual(6)
    expect(diffEntry.diff_list).toEqual([2,1,0,1,2,5])
    expect(diffEntry.sum).toEqual(11)


  })

  test('part 1', async () => {
    const testDataRaw = await readFileByLines("2024/day-01/day-01.data.txt")
    
    let totalSum = 0;
    const diffEntries: DiffLine[] = [];
    let pos = 0;
    

    const ParsedEntry = parseLines(testDataRaw)
    const sortedLine = sortLEntry(ParsedEntry)
    const diff = calculateDiff(sortedLine);
    diffEntries.push(diff);
    
    console.log('2024 Day One total sum:', diff.sum)

    expect(diff.sum).toEqual(1879048);

  })

})