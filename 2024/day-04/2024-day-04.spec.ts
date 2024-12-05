import { describe, expect, test } from 'vitest'
import { readFileByLines, splitByNewLinesAndRemoveEmpty } from '../../utils/read-file'


// Constants
const YEAR = "2024"
const DAY = "04"
const PRINT_OUTPUT = false

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`



interface ParsedResult {
  entries: ParsedEntry[];
}

interface ParsedEntry {
  line: string;
  value: string;
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
  // searchGrid(input, "XMAS")

  const parsedEntry: ParsedEntry = {
    line: '',
    value: searchGrid(input, "XMAS").toString()
  };



  result.entries.push(parsedEntry)

  return result;
}


function searchGrid(grid: string[], searchStr: string): number {
  const highlight: string[] = []
  const height = grid.length;
  const width = grid[0].length;

  let countFound = 0;
  const remainingToSearch = searchStr.substring(1, searchStr.length).split('')

  // console.log(`remainingToSearch: ${remainingToSearch}`)
  for (let i = 0; i < height; i++) {
    let highlight_row = ''
    for (let j = 0; j < width; j++) {

      let matchFound = false
      //console.log(grid[i][j])
      // match on first letter
      if (grid[i][j] === searchStr[0]) {



        // now search around that cell
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {

            // star

            // skip over our starting point
            if (k === 0 && l === 0) continue;



            for (let remainingIndex = 1; remainingIndex <= remainingToSearch.length; remainingIndex++) {
              const row = i + k * remainingIndex;
              const col = j + l * remainingIndex;


              if (row < 0 || row >= height || col < 0 || col >= width) {
                // we are out of bound of the grid
                break;
              }


              // respective to the current iteration
              if (grid[row][col] !== remainingToSearch[remainingIndex - 1]) {
                break;
              }

              // If we have reached the end of the loop
              if (remainingIndex === remainingToSearch.length) {

                // Found one
                matchFound = true
                countFound += 1
              }
            }

          }
        }
      }

      if (matchFound) {
        highlight_row = `${highlight_row}${grid[i][j]}`;
      } else {
        highlight_row = highlight_row + "-"
      }
    }
    highlight.push(highlight_row)

  }
  if (PRINT_OUTPUT) {
    for (const line of highlight)
      console.log(line)

    for (const line of grid)
      console.log(line)

    console.log(`countFound`, countFound)
  }
  return countFound;
}


function searchGridPart2AsGrid(grid: string[]): number {

  const matchGrid1 = [
    ['M', null, 'S'],
    [null, 'A', null],
    ['M', null, 'S']
  ];


  const matchGrid2 = [
    ['S', null, 'S'],
    [null, 'A', null],
    ['M', null, 'M']
  ];



  const matchGrid3 = [
    ['S', null, 'M'],
    [null, 'A', null],
    ['S', null, 'M']
  ];


  const matchGrid4 = [
    ['M', null, 'M'],
    [null, 'A', null],
    ['S', null, 'S']
  ];

  // so hack way for all the grid combos
  const matchGrids = [
    matchGrid1,
    matchGrid2,
    matchGrid3,
    matchGrid4
  ]

  const highlight: string[] = []
  const height = grid.length;
  const width = grid[0].length;

  let countFound = 0;

  // console.log(`remainingToSearch: ${remainingToSearch}`)
  for (let i = 0; i < height; i++) {
    let highlight_row = ''
    for (let j = 0; j < width; j++) {

      let matchFound = false
      //console.log(grid[i][j])
      // match on first letter

      for (const matchGridCurrent of matchGrids) {
        if (grid[i][j] === matchGridCurrent[1][1]) {


          const matchCountRequired = 4 // out the outside skipping the center
          let matchCountSoFar = 0

          // now search around that cell
          for (let k = -1; k <= 1; k++) {
            for (let l = -1; l <= 1; l++) {

              const matchRow = 1 + k
              const matchCol = 1 + l

              // if starting point skip
              if (k === 0 && l === 0) continue;

              const row = i + k;
              const col = j + l;


              if (row < 0 || row >= height || col < 0 || col >= width) {
                // we are out of bound of the grid

                continue;
              }

              // part of grid we don't have to match

              // if (match_grid[matchRow][matchCol] === null) continue;

              // If we have reached the end of the loop
              if (grid[row][col] === matchGridCurrent[matchRow][matchCol]) {

                matchCountSoFar += 1
              }

            }
          }

          // console.log('matchCountSoFar', matchCountSoFar)
          if (matchCountSoFar === matchCountRequired) {
            matchFound = true
            countFound += 1
          }

        }
      }
      if (matchFound) {
        highlight_row = `${highlight_row}${grid[i][j]}`;
      } else {
        highlight_row = highlight_row + "-"
      }




    }
    highlight.push(highlight_row)

  }
  if (PRINT_OUTPUT) {
    for (const line of highlight)
      console.log(line)

    for (const line of grid)
      console.log(line)

    console.log(`countFound`, countFound)
  }
  return countFound;
}




const printResult = (result: ParsedResult) => {
  const padLength = 15
  const printList: any[] = [];

  for (const entry of result.entries) {
    const printObj = {}
    printObj['line'] = entry.line.padEnd(padLength, ' ');
    printList.push(printObj);

  }

  if (PRINT_OUTPUT) {
    console.table(printList);
  }
}


// -------------------- tests below this -------------------



describe(TITLE, () => {

  test('example: part 1', () => {

    let data = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
      `;

    const entry = parseLines(splitByNewLinesAndRemoveEmpty(data))
    printResult(entry)

    expect(entry.entries[0].line).toEqual('')
    expect(entry.entries[0].value).toEqual('18')

  })



  test('answer: part 1', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)
  })


  test('example: part 2', () => {
    let data = `
      .M.S......
      ..A..MSMS.
      .M.S.MAA..
      ..A.ASMSM.
      .M.S.M....
      ..........
      S.S.S.S.S.
      .A.A.A.A..
      M.M.M.M.M.
      ..........
      `;

    const entry = searchGridPart2AsGrid(splitByNewLinesAndRemoveEmpty(data))
    expect(entry).toBe(9)

  })


  test('answer: part 2', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)
    const entry = searchGridPart2AsGrid(testDataRaw)
    expect(entry).toBe(2029)

  })

})