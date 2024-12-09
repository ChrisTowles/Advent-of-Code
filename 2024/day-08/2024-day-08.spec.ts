import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "08"

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface Position {
  row: number;
  col: number;
}

enum CharLookup {
  Empty = ".",
}


function getGridOfAntennas(input: ParsedResult): Map<string, Position[]> {



  return input.entries.reduce<Map<string, Position[]>>((antennas, e, row) => {

    [...e.line].forEach((cell, col) => {
      if (cell === CharLookup.Empty) {
        return;
      }
      antennas[cell] = antennas[cell] ?? []
      antennas[cell].push({ row, col });
    });
    return antennas;
  }, new Map<string, Position[]>());
}

interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  value: string;
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
  for (const line of input) {
    const parsedEntry: ParsedEntry = {
      line: line,
      value: ''
    };

    result.entries.push(parsedEntry)
  }

  return result;
}

const solvePart1 = async (input: ParsedResult): Promise<Number> => {

  let maxRow = input.entries.length - 1;
  let maxCol = input.entries[0].line.length - 1;
  let antennas = getGridOfAntennas(input);
  let antiNodes = new Set<string>();


  Object.keys(antennas).forEach( key => {
    const frequencyMatch = antennas[key] as Position[]
    
    // now for each antenna if this type
    frequencyMatch.forEach((antennaA, index) => {

      let remaining = frequencyMatch.slice(index + 1)
      remaining.forEach(antennaB => {
        let rowDiff = antennaA.row - antennaB.row;
        let colDiff = antennaA.col - antennaB.col;

        [
          { row: antennaA.row + rowDiff, col: antennaA.col + colDiff }, // one step in the same direction
          { row: antennaB.row - rowDiff, col: antennaB.col - colDiff }, // one step in the other
        ]
          .filter(({ row, col }) => isInBound({row, col, maxRow, maxCol}))
          .forEach(({ row, col }) => antiNodes.add(`${row},${col}`));
      });
    });
  });

  return antiNodes.size;

}

const isInBound = ({ row, col, maxRow, maxCol }: { row: number; col: number; maxRow: number; maxCol: number }): boolean => {
  return row >= 0 && row <= maxRow && col >= 0 && col <= maxCol
}

const solvePart2 = async (input: ParsedResult): Promise<Number> => {

  let maxRow = input.entries.length - 1;
  let maxCol = input.entries[0].line.length - 1;
  let antennas = getGridOfAntennas(input);
  let antiNodes = new Set<string>();

  Object.keys(antennas).forEach( key => {
    const frequencyMatch = antennas[key] as Position[]

    
    frequencyMatch.forEach((antennaA, index) => {
      frequencyMatch.slice(index + 1).forEach(antennaB => {
        let rowDiff = antennaA.row - antennaB.row;
        let colDiff = antennaA.col - antennaB.col;

  
        let {row: rowA, col: colA} = antennaA;   
        while( isInBound({row: rowA, col: colA, maxRow, maxCol})) {
          antiNodes.add(`${rowA},${colA}`);
          rowA += rowDiff
          colA += colDiff  
        }

        let {row: rowB, col: colB} = antennaB;
        while(isInBound({row: rowB, col: colB, maxRow, maxCol})) {
          antiNodes.add(`${rowB},${colB}`);
          rowB -= rowDiff
          colB -= colDiff
        }
      });
    });
  });

  return antiNodes.size;


}

// -------------------- tests below this -------------------

describe(TITLE, () => {

  // antana = single lowercase letter, uppercase letter, or digit.

  let exampleDataPart1 = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
    `;

  test('example: part 1', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart1(entry)
    expect(answer).toEqual(14)
  })

  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    const answer = await solvePart1(entry)
    expect(answer).toEqual(327)

  })

  test('example: part 2', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart2(entry)
    expect(answer).toEqual(34)
  })

  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = parseLines(testDataRaw)
    const answer = await solvePart2(entry)
    expect(answer).toEqual(1233)
  })

})