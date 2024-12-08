import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'
import { g } from 'vitest/dist/chunks/suite.B2jumIFP.js'


// Constants
const YEAR = "2024"
const DAY = "06"
const PRINT_OUTPUT = false

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  grid: Int8Array;
  width: number;
  height: number;
  startPos: number,
  startX: number,
  startY: number,
}

enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

enum CharLookup {
  WALL = 35,
  GUARD = 94, // ^
  EMPTY = 46,
  NEW_LINE = 10,
}

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;

const NEXT_DIRECTION = {
  [Direction.NORTH]: Direction.EAST,
  [Direction.EAST]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.WEST,
  [Direction.WEST]: Direction.NORTH,
};


const parseLines = (input: string[]): ParsedResult => {

  const length = input.length * input[0].length
  let result: ParsedResult = { 
    grid: new Int8Array(length),
    width: input[0].length,
    height: input.length,
    startPos: 0,
    startX: 0,
    startY: 0,
   };

   
   for (let i = 0; i < input.length; i++) {
     for (let j = 0; j < input[i].length; j++) {
      const c = input[i].charCodeAt(j);
      result.grid[(i * input[i].length) + j] = c
    }
  }

  
  const startPos = result.grid.indexOf(CharCode.GUARD);
  if (startPos === -1)  {
    throw new Error("could not find a Guard not found");
  } 
  result.startPos = startPos

  result.startX = Math.floor(startPos / result.width);
  result.startY = result.startPos % result.width;

  return result;
}


const posToFlat = (input: ParsedResult, i: number, j: number) => i * input.width + j;

const encodePosition = (flatPos: number, direction: Direction): number =>
  (direction << 16) | flatPos;

const isInBounds = (input: ParsedResult, i: number, j: number) =>
  i >= 0 && i < input.height && j >= 0 && j < input.width;


const solvePart1 = async(input: ParsedResult): Promise<Number> => {


  const startX = Math.floor(input.startPos / input.width);
  const startY = input.startPos % input.width;
  let [x, y] = [startX, startY];

  

  
  let visited = new Set<number>();
  let facing = Direction.NORTH;

  // Add initial position
  visited.add(posToFlat(input, x, y));

  while (true) {
    const [dx, dy] = DIRECTIONS[facing];
    if (!isInBounds(input, x + dx, y + dy)) {
      break;
    }

    if (input.grid[posToFlat(input, x + dx, y + dy)] === CharLookup.WALL) {
      facing = NEXT_DIRECTION[facing];
      continue;
    }

    x += dx;
    y += dy;

    visited.add(posToFlat(input, x, y));
  }

  return visited.size;
}


const  isLooping = (
  input: ParsedResult,
  startX: number,
  startY: number
): boolean  => {
  
  
  let [x, y] = [startX, startY];
  let facing = Direction.NORTH;
  let seen = new Set<number>();

  while (true) {

    const [dx, dy] = DIRECTIONS[facing];
    if (!isInBounds(input, x + dx, y + dy)) {
      break;
    }

    if (input.grid[posToFlat(input, x + dx, y + dy)] === CharLookup.WALL) {
      const key = encodePosition(posToFlat(input, x, y), facing);
      if (seen.has(key)) {
        return true;
      }
      facing = NEXT_DIRECTION[facing];
      seen.add(key);
      continue;
    }

    x += dx;
    y += dy;
  }

  return false;
}



const solvePart2 = async(input: ParsedResult): Promise<Number> => {

  let facing = Direction.NORTH;
  let cache = new Set<number>();
  let [x, y] = [input.startX, input.startY];
  

  while (true) {
    const [dx, dy] = DIRECTIONS[facing];
  
    if (!isInBounds(input, x + dx, y + dy)) {
      break;
    }

    const dKey = posToFlat(input, x + dx, y + dy);
    const char = input.grid[dKey];
  
    if (char === CharLookup.WALL) {
      // turn right
      facing = NEXT_DIRECTION[facing];
      continue;
    }

    // skip it if already hit
    if (cache.has(dKey)) {
      // forward
      x += dx;
      y += dy;
      continue;
    }

    input.grid[dKey] = CharLookup.WALL;


    if (isLooping(input, input.startX, input.startY)) {
      cache.add(dKey);
    }

    input.grid[dKey] = CharLookup.EMPTY;

    x += dx;
    y += dy;
  }

  return cache.size;

}


// -------------------- tests below this -------------------



describe(TITLE, () => {

  let exampleDataPart1 = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
    `;

  test('example: part 1', async() => {

    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart1(entry)

    expect(answer).toEqual(41)

  })



  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    const answer = await solvePart1(entry)
    expect(answer).toEqual(5208)

  })


  test('example: part 2', async () => {
    const entry = parseLines(splitByNewLinesAndRemoveEmpty(exampleDataPart1))
    const answer = await solvePart2(entry)
    expect(answer).toEqual(6)
  })



  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
    const answer = await solvePart2(entry)
    expect(answer).toEqual(1972)
   
  })


})