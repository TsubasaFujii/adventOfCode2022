import { promises as fs } from 'fs';

async function getData(): Promise<string | undefined> {
    const rawData = await fs.readFile('./Day6/data.txt', 'utf8');
    return rawData;
}

function getMakerIndex(data: string, length: number): number | undefined {
    let key: string = '';
    for (let i = 0; i < data.length; i++) {
        if (key.length === length) {
            return i;
        }
        const duplicatedLetterIndex = key.indexOf(data[i]);
        if (duplicatedLetterIndex > -1) {
            key = key.slice(duplicatedLetterIndex + 1);
        }
        key += data[i];
    }
    return;
}

async function run() {
    const data = await getData();
    if (!data) {
        throw new Error('Data doesn\'t exist.');
    }
    const part1 = getMakerIndex(data, 4);
    console.log(`Part1: ${part1}`);

    const part2 = getMakerIndex(data, 14);
    console.log(`Part2: ${part2 ? part2 : 'couldn\'t find'}`);
}

run();