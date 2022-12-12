import { promises as fs } from 'fs';
import { log } from '../log';


interface Data {
    fileName: string;
    size: number;
}


type NestedArray<T> = Array<T> | Array<NestedArray<T>>;

type Folder = {
    [folderName: string]: Folder;
} & {
    localFiles?: Data[];
}

enum Command {
    'ChangeDirectory' = 'cd',
    'FileList' = 'ls'
}

async function getData(): Promise<string[] | undefined> {
    const rawData = await fs.readFile('./Day7/data.txt', 'utf8');
    return rawData.split(/\r?\n/);
}

function isCommand(str: string) {
    return str === '$';
}

function getDirectory(data: string[]): Folder {
    const cdHistory: string[] = [];
    return data.reduce((directory: Folder, line, index): Folder => {
        const splitLine = line.split(' ');
        if (isCommand(splitLine[0])) {
            if (splitLine[1] === Command.ChangeDirectory) {
                const fileName = splitLine[2];

                if (fileName === '..') {
                    // Go up one directory
                    cdHistory.pop();
                } else {
                    // Go down one directory
                    cdHistory.push(fileName);
                }
            } else if (splitLine[1] === Command.FileList) {

                const currentFolder = cdHistory.reduce((targetFolder, name): Folder => targetFolder[name], directory);

                let nextLine: number = index + 1;
                while (nextLine < data.length && data[nextLine].charAt(0) !== '$') {
                    const [firstPart, secondPart] = data[nextLine].split(' ');
                    if (firstPart === 'dir') {
                        currentFolder[secondPart] = {}
                    } else {
                        if (!currentFolder.localFiles) {
                            currentFolder.localFiles = [];
                        }
                        currentFolder.localFiles.push({
                            fileName: secondPart,
                            size: Number(firstPart),
                        });
                    }
                    nextLine++;
                }
            }
        }
        return directory;
    }, { '/': {} });
}

function isObject(a: any): boolean {
    return a !== null && typeof a === 'object' && !Array.isArray(a);
}

function getAnswers(dir: Folder, allFolderSizes: number[] = []): { size: number, part1: number, allFolderSizes: number[] } {
    let dirSize = 0;
    let garbage = 0;
    const { localFiles } = dir;

    // sum up the size of local files
    if (localFiles) {
        localFiles.forEach(({ size }) => dirSize += size);
    }

    // for each subdir in dir
    const subFolders = Object.keys(dir).filter(key => isObject(dir[key]));
    subFolders.forEach(folder => {
        const subDir = getAnswers(dir[folder], allFolderSizes);
        dirSize += subDir.size;
        garbage += subDir.part1;
    })

    if (dirSize <= 100000) {
        garbage += dirSize;
    }

    allFolderSizes.push(dirSize);
    return { size: dirSize, part1: garbage, allFolderSizes }
}

function findTargetFolderSize(totalFolderSize: number, list: number[]): number {
    const folders = list.filter(dirSize => 30_000_000 <= (70_000_000 - totalFolderSize + dirSize));
    return folders.reduce((result, size) => Math.min(result, size), folders[0]);
}

async function run() {
    const data = await getData();
    if (!data) {
        throw new Error('Data doesn\t exist')
    }
    const directory = getDirectory(data);
    const { size, part1, allFolderSizes } = getAnswers(directory);

    console.log(`Answer to part 1: ${part1}, answer to part 2: ${findTargetFolderSize(size, allFolderSizes)}`);
}

run();