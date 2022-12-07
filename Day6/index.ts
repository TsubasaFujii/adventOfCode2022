import { promises as fs } from 'fs';

async function getData(): Promise<string | undefined> {
    const rawData = await fs.readFile('./Day6/data.txt', 'utf8');
    return rawData;
}