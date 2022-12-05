import { promises as fs } from 'fs';

async function getData(): Promise<string[] | undefined> {
    const rawData = await fs.readFile('./Day4/data.txt', 'utf8');
    return rawData.split(/\r?\n/);
}

function countEntireOverlaps(data: string[] | undefined): number | undefined {
    if (!data) return;

    return data.reduce((total: number, current: string): number => {
        // example for current: '7-27,26-27'
        const [first, second] = current.split(',');
        const [firstStart, firstEnd] = first.split('-').map(item => Number(item));
        const [secondStart, secondEnd] = second.split('-').map(item => Number(item));

        // When the entire range is inside of the other
        if ((secondStart <= firstStart && firstEnd <= secondEnd) ||
            (firstStart <= secondStart && secondEnd <= firstEnd)) {
            total += 1;
        }
        return total;
    }, 0);
}

function countPartialOverlaps(data: string[] | undefined): number | undefined {
    if (!data) return;

    return data.reduce((total: number, current: string): number => {
        // example for current: '7-27,26-27'
        const [first, second] = current.split(',');
        const [firstStart, firstEnd] = first.split('-').map(item => Number(item));
        const [secondStart, secondEnd] = second.split('-').map(item => Number(item));

        // When the entire range is out side of the other
        if ((secondStart < firstStart && secondEnd < firstStart) ||
            (firstEnd < secondStart && firstEnd < secondEnd) ||
            (firstStart < secondStart && firstEnd < secondStart) ||
            (secondEnd < firstStart && secondEnd < firstEnd)) {
            return total;
        }
        total += 1;
        return total;
    }, 0);
}

async function run() {
    const data = await getData();
    const part1 = countEntireOverlaps(data);
    console.log('Part1: ', part1);
    const part2 = countPartialOverlaps(data);
    console.log('Part2: ', part2);
}

run();