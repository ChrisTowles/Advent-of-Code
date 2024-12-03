import * as fs from 'fs';
import * as path from 'path';

async function copyAndReplace(sourceFile: string, replacements: { [key: string]: string }): Promise<void> {
  try {

    let targetFile: string = sourceFile
    // Read the content of the source file
    const content = await fs.promises.readFile(sourceFile, 'utf-8');

    // Replace values in the content
    let newContent = content;
    for (const [key, value] of Object.entries(replacements)) {
      newContent = newContent.replace(new RegExp(key, 'g'), value);
      targetFile = targetFile.replace(new RegExp(key, 'g'), value);
    }
    const folderPath = path.dirname(targetFile);
    await fs.promises.mkdir(folderPath, { recursive: true });

    // Write the new content to the target file
    await fs.promises.writeFile(targetFile, newContent, 'utf-8');

    console.log('File copied and values replaced successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}


// Example usage


const files = [
    '202X/day-0X/202X-day-0X.data.txt', 
    '202X/day-0X/202X-day-0X.spec.ts'
];

const main = async () => {


    // read a command line parameter to get the year and day
    if (process.argv.length < 3) {
        console.log('Usage: nr create <year> <day>');
        process.exit(1);
    }
    
    const year = parseInt(process.argv[2], 10);
    const day = parseInt(process.argv[3], 10);

    const replacements = {
        '202X': process.argv[2],
        '0X': process.argv[3]
      };
    

    await copyAndReplace(files[0], replacements);
    await copyAndReplace(files[1], replacements);
}

main();