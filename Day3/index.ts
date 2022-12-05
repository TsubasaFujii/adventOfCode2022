import { promises as fs } from 'fs';

const ALPHABETS: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

async function getCaloryData(): Promise<string[] | undefined> {
    const rawData = await fs.readFile('./Day3/data.txt', 'utf8');
    return rawData.split(/\r?\n/);
}

function getSumForPart1(itemData: string[]): number | undefined {
    if (!itemData) return;

    const priorityList = itemData.reduce((result: string[], current: string): string[] => {
        const middle = current.length / 2;
        const firstCompartment = current.slice(0, middle);
        const secondCompartment = current.slice(middle);

        const priority = [...firstCompartment]
            .filter((letter, index) => firstCompartment.indexOf(letter) === index) // Getting rid of duplicated alphabet
            .filter(letter => secondCompartment.indexOf(letter) > -1); // Checking common alphabets
        return result.concat(priority);
    }, []);
    return priorityList.reduce((sum: number, priority: string): number => sum += ALPHABETS.indexOf(priority) + 1, 0);
}

function getSumForPart2(itemData: string[]): number | undefined {
    if (!itemData) return;

    let sum: number = 0;
    for (let i = 0; i < itemData.length; i = i + 3) {
        const first = itemData[i];
        const second = itemData[i + 1];
        const third = itemData[i + 2];
        const longest = [first, second, third].reduce((a, b) => {
            return a.length > b.length ? a : b;
        });

        const priority = [...longest]
            .filter((letter, index) => longest.indexOf(letter) === index) // Removing duplicated letter
            .filter(letter => first.indexOf(letter) > -1 && second.indexOf(letter) > -1 && third.indexOf(letter) > -1); // Checking common alphabets
        const points = priority.reduce((total: number, priority: string): number => total += ALPHABETS.indexOf(priority) + 1, 0);
        sum += points;
    }
    return sum;
}

async function run(): Promise<void> {
    const data = await getCaloryData();
    if (!data) {
        throw new Error('Data doesn\'t exist.');
    }
    const sum1 = getSumForPart1(data);
    console.log('Part 1', sum1);
    const sum2 = getSumForPart2(data);
    console.log('Part 2', sum2);
}

run();