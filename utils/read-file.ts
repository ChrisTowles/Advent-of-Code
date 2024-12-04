import fsPromises from "node:fs/promises";


export async function readFile(filePath: string): Promise<string> {
  try {
    const data = await fsPromises.readFile(filePath, {encoding: 'utf-8'});
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}


export async function readFileByLines(filePath: string): Promise<string[]> {

  // doest read line by line but returns list of lines. 
  let data = await  readFile(filePath)
  let lines = splitByNewLinesAndRemoveEmpty(data)
  return lines
}

export function splitByNewLinesAndRemoveEmpty(value: string): string[] {

  return value.split('\n').map(line => line.trim()).filter(line => line !== '');

}