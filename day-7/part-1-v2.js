const fs = require("fs");
const _ = require("lodash");

const LIMIT = 100000;

// did not work: 1027500 - too low
// did not work: 1077191
// did not work: 1095702 - wrong answer
// did not work: 1172628 - too high

let dirTotal = 0;

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

class Directory {
    constructor(name = "/", parent = null) {
        this.name = name;
        this.parent = parent;
        this.contents = [];
    }

    addDirectory(name) {
        this.contents.push(new Directory(name, this));
    }

    addFile(name, size) {
        this.contents.push(new File(name, size));
    }

    getSize() {
        const itemSize = this.contents
            .filter((item) => item.constructor.name === "File")
            .map((item) => item.size)
            .reduce((a, b) => a + b, 0);

        const directorySize = this.contents
            .filter((item) => item.constructor.name === "Directory")
            .map((item) => item.getSize())
            .reduce((a, b) => a + b, 0);


        this.size = itemSize + directorySize;

        return this.size;
    }

    getDirectories() {
        const dirs = this.contents.filter(item => item.constructor.name === 'Directory');
        return [...dirs];
        // return [...dirs, ...dirs.map(dir => dir.getDirectories())]
    }
}

class File {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
}

// console.log(main(sampleInput));

console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    let total = 0;
    dirTotal = 0;

    const filesystem = new Directory();
    let currentDirectory = filesystem;

    const commands = puzzleInput.split("\n");

    commands.forEach((command) => {
        const directoryMatch = command.match(/^dir (.*)$/);
        const fileMatch = command.match(/^(\d+) (.*)$/);
        const cdMatch = command.match(/^\$ cd (.*)$/);
        if (directoryMatch) {
            currentDirectory.addDirectory(directoryMatch[1]);
        } else if (fileMatch) {
            currentDirectory.addFile(fileMatch[2], Number(fileMatch[1]));
        } else if (cdMatch) {
            if (cdMatch[1] === "..") {
                currentDirectory = currentDirectory.parent;
            } else if (cdMatch[1] === "/") {
                currentDirectory = filesystem;
            } else {
                currentDirectory = currentDirectory.contents
                    .filter((item) => item.constructor.name === "Directory")
                    .find((dir) => dir.name === cdMatch[1]);
            }
        }
    });

    filesystem.getSize();

    const allDirectories = filesystem.getDirectories();

    console.log(filesystem);

    calculateDirectorySize(filesystem);

    return dirTotal;
}




function calculateDirectorySize (directory, total = 0) {
    if (directory.size <= LIMIT) {
        dirTotal += directory.size;
    }

    directory.contents.filter(item => item.constructor.name === 'Directory').forEach(dir => calculateDirectorySize(dir))
}