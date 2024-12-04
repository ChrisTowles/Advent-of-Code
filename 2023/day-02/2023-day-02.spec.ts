import { describe, expect, test } from 'vitest'
import { readFileByLines } from '../../utils/read-file'
import c from 'tinyrainbow'

// Constants
const YEAR = "2023"
const DAY = "02"
const PRINT_OUTPUT = false

// Paths
const RAW_DATA_PATH = `${YEAR}/day-${DAY}/${YEAR}-day-${DAY}.data.txt`
const TITLE = `${YEAR}/day-${DAY}`


interface ParsedResult {
  entries: ParsedEntry[];
}

interface GameSet {
  red: number,
  blue: number,
  green: number
}
interface ParsedEntry {
  line: string;
  gameNumber: number
  sets: GameSet[];
  included: boolean;
  
}

const parseLines = (input: string[]): ParsedResult => {

  let result: ParsedResult = { entries: [] };
    

  for (const line of input) {

    const gameNumberMatchResult = line.match(/^Game (\d+):/);
    const entry: ParsedEntry = { 
      line: line,
      gameNumber: 0,
      sets: [],
      included: true
    }
    entry.gameNumber = Number(gameNumberMatchResult![1]);

    let setData = line.split(':')[1];
    let sets = setData.split(';');

    sets.forEach((set) => {
      const setMatchResult = set.match(/(\d+) (red|blue|green)/g);
      if (setMatchResult) {
        let gameSet: GameSet = { red: 0, blue: 0, green: 0 };
        setMatchResult.forEach((item) => {
          const [count, color] = item.split(' ');
          gameSet[color] = Number(count);
        });

        entry.sets.push(gameSet);
      }
    })


    // console.log(gameNumberMatchResult);
    result.entries.push(entry)
  }

  return result;
}

const printGameSet = (gameSet: GameSet) => {
  return `r: ${gameSet.red}, b: ${gameSet.blue}, g: ${gameSet.green}`
}


const printResult = (result: ParsedResult) => {

  const printList: any[] = [];

  for (const entry of result.entries) {
    const printObj = {}
    printObj['gameNumber'] = entry.gameNumber;
    printObj['included'] = entry.included ?  c.green(entry.included) : c.red(entry.included);
    printObj['sets'] = entry.sets.map(printGameSet).join("   " );
    const padLength = 50
    printList.push(printObj);
    
    // console.log(`${i + 1} - gameNumber: ${entry.gameNumber.toString().padEnd(4, ' ')} - include: ${entry.included}- sets ${entry.sets.map(printGameSet).join('|').padEnd(padLength, ' ')} - original ${entry.line}`);
  }
  if(PRINT_OUTPUT) {
    console.table(printList);
  }
}





const filterGamesOnPossibleSet = (result: ParsedResult, maxGameSet: GameSet): ParsedResult => {
  
  result.entries.forEach((entry) => {
    entry.included = entry.sets.every(s => s.red <= maxGameSet.red && s.blue <= maxGameSet.blue && s.green <= maxGameSet.green);
  });
  return result;

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
    // printResult(entry)

  })


  test('parse lines filter', () => {
    const entry = parseLines(getExampleInput())

    const filterGames = filterGamesOnPossibleSet(entry, {red: 12, blue: 13, green: 14})


    const sum = filterGames.entries.filter(x => x.included ).reduce((acc, curr) => acc + curr.gameNumber, 0);
    expect(sum).toEqual(8);

    // printResult(filterGames)

  })


  test('answer', async () => {
    const testDataRaw = await readFileByLines(RAW_DATA_PATH)

    const entry = parseLines(testDataRaw)

    const filterGames = filterGamesOnPossibleSet(entry, {red: 12, blue: 13, green: 14})
    // printResult(filterGames)
    const sum = filterGames.entries.filter(x => x.included ).reduce((acc, curr) => acc + curr.gameNumber, 0);
    // expect(sum).toEqual(1234) // not yet right
  })


})