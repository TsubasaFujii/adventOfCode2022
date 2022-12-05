import { promises as fs } from 'fs';

async function getCaloryData(): Promise<number[][] | undefined> {
    const rawData = await fs.readFile('./Day1/data.txt', 'utf8');
    return parseData(rawData);
}

function parseData(data: string): number[][] | undefined {
    if (!data) return;

    return data.split(/\r?\n/).reduce((result: number[][], current: string): number[][] => {
        if (current === '') {
            result.push(Array(0));
        } else {
            result[result.length - 1].push(parseInt(current));
        }
        return result;
    }, [[]]);
}

function sumUpArray(arr: number[]): number {
    return arr.reduce((sum, current) => sum += current, 0);
}

function compareNumbers(a: number, b: number) {
    return b - a;
}

async function run(): Promise<void> {
    const data = await getCaloryData();
    if (!data) {
        console.log('Data doesn\'t exist');
        return;
    }

    const maxCalories = data.reduce((result: number, current: number[]): number => {
        return Math.max(result, sumUpArray(current));
    }, 0);
    console.log(`Part1: The most calories that an elf is carry is ${maxCalories}`);

    const top3Calories = data.reduce((result: number[], current: number[]): number[] => {
        const currentSum = sumUpArray(current);
        if (result[result.length - 1] < currentSum) {
            result.pop();
            result.push(currentSum);
            result.sort(compareNumbers);
        }
        return result;
    }, [0, 0, 0]);
    const total = top3Calories.reduce((sum, current) => sum += current, 0);
    console.log(`Part2: total of top 3 -> ${total} calories`)
}

run();