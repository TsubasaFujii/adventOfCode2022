import { promises as fs } from 'fs';

const crates = [
    ['f', 'c', 'j', 'p', 'h', 't', 'w'],
    ['g', 'r', 'v', 'f', 'z', 'j', 'b', 'h'],
    ['h', 'p', 't', 'r'],
    ['z', 's', 'n', 'p', 'h', 't'],
    ['n', 'v', 'f', 'z', 'h', 'j', 'c', 'd'],
    ['p', 'm', 'g', 'f', 'w', 'd', 'z'],
    ['m', 'v', 'z', 'w', 's', 'j', 'd', 'p'],
    ['n', 'd', 's'],
    ['d', 'z', 's', 'f', 'm']
];

async function getData(): Promise<string[] | undefined> {
    const rawData = await fs.readFile('./Day5/data.txt', 'utf8');
    return rawData.split(/\r?\n/);
}

function parseData(data: string[] | undefined): number[][] | undefined {
    if (!data) return;

    return data.map(item => {
        const splitData = item.split(' ');
        const numbers = splitData.filter(data => !data.match(/\D/g));
        return numbers.map(num => Number(num));
    });
}

function moveCrates1(data: number[][] | undefined): string | undefined {
    if (!data) return;

    const newCreates = JSON.parse(JSON.stringify(crates));
    for (let i = 0; i < data.length; i++) {
        // First value: how many time to move a create, Second: position from, Third: position to
        const [times, from, to] = data[i];
        for (let j = 0; j < times; j++) {
            const target = newCreates[from - 1];
            newCreates[to - 1].push(target[target.length - 1]);
            newCreates[from - 1].pop();
        }
    }
    return crates.map(item => item[item.length - 1].toUpperCase()).join('');
}

function moveCrates2(data: number[][] | undefined): string | undefined {
    if (!data) return;

    const newCreates: string[][] = JSON.parse(JSON.stringify(crates));
    for (let i = 0; i < data.length; i++) {
        // First value: how many creates to be moved, Second: position from, Third: position to
        const [NumOfItemsToBeMoved, from, to] = data[i];
        const targetRow = newCreates[from - 1];
        const itemsToBeMoved = targetRow.slice(targetRow.length - NumOfItemsToBeMoved);
        newCreates[to - 1] = newCreates[to - 1].concat(itemsToBeMoved);
        newCreates[from - 1] = targetRow.slice(0, targetRow.length - NumOfItemsToBeMoved);
    }
    return newCreates.map(item => item[item.length - 1].toUpperCase()).join('');
}

async function run() {
    const data = await getData();
    const parsedData = parseData(data)
    const result1 = moveCrates1(parsedData);
    console.log('Part1:', result1);
    const result2 = moveCrates2(parsedData);
    console.log('Part2:', result2);
}

run();