import { promises as fs } from 'fs';

const score1: { [key: string]: number } = {
    'X': 1,
    'Y': 2,
    'Z': 3,
}

const score2: { [key: string]: number } = {
    rock: 1,
    paper: 2,
    scissors: 3,
}

enum Elf {
    'Rock' = 'A',
    'Paper' = 'B',
    'Scissors' = 'C',
}

enum Me {
    'Rock' = 'X',
    'Paper' = 'Y',
    'Scissors' = 'Z',
}

enum Result {
    'Lose' = 'X',
    'Draw' = 'Y',
    'Win' = 'Z',
}

async function getStrategyData(): Promise<string[][] | undefined> {
    const rawData = await fs.readFile('./Day2/data.txt', 'utf8');
    return parseData(rawData);
}

function parseData(data: string): string[][] | undefined {
    if (!data) return;
    return data.split(/\r?\n/).reduce((result: string[][], current: string): string[][] => {
        result.push(current.split(' '))
        return result;
    }, []);
}

function calculateScore1(data: string[][] | undefined): number | undefined {
    if (!data) return;
    return data.reduce((result, current) => {
        const elf = current[0];
        const me = current[1];
        // win
        if (elf === Elf.Rock && me === Me.Paper ||
            elf === Elf.Paper && me === Me.Scissors ||
            elf === Elf.Scissors && me === Me.Rock) {
            result += 6;
            // draw
        } else if (elf === Elf.Paper && me === Me.Paper ||
            elf === Elf.Rock && me === Me.Rock ||
            elf === Elf.Scissors && me === Me.Scissors) {
            result += 3;
        }
        result += score1[me];
        return result;
    }, 0);
}

async function part1(): Promise<void> {
    const data = await getStrategyData();
    const result = calculateScore1(data);
    console.log(`Part1: Your point is ${result} points in total`)
}

function calculateScore2(data: string[][] | undefined): number | undefined {
    if (!data) return;
    return data.reduce((sum, current) => {
        const elf = current[0];
        const result = current[1];
        const { scissors, rock, paper } = score2;
        if (elf === Elf.Paper && result === Result.Win) {
            sum += 6;
            sum += scissors;
        } else if (elf === Elf.Paper && result === Result.Draw) {
            sum += 3;
            sum += paper;
        } else if (elf === Elf.Paper && result === Result.Lose) {
            sum += rock;
        } else if (elf === Elf.Rock && result === Result.Win) {
            sum += 6;
            sum += paper;
        } else if (elf === Elf.Rock && result === Result.Draw) {
            sum += 3;
            sum += rock;
        } else if (elf === Elf.Rock && result === Result.Lose) {
            sum += scissors;
        } else if (elf === Elf.Scissors && result === Result.Win) {
            sum += 6;
            sum += rock;
        } else if (elf === Elf.Scissors && result === Result.Draw) {
            sum += 3;
            sum += scissors;
        } else if (elf === Elf.Scissors && result === Result.Lose) {
            sum += paper;
        }
        return sum;
    }, 0);
}

async function part2(): Promise<void> {
    const data = await getStrategyData();
    const result = calculateScore2(data);
    console.log(`Part2: Your point is ${result} points in total`)
}

function run(): void {
    part1();
    part2();
}

run();