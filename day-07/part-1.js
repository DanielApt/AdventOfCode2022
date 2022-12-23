const fs = require("fs");
const _ = require("lodash");

const LIMIT = 100000;

// did not work: 1027500 - too low

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const commands = puzzleInput.split("\n");
    let fileSystem = [];
    let currentDirectory = "";

    for (let i = 0; i < commands.length; i++) {
        // process command
        if (commands[i].match(/^\$ cd/g)) {
            const directory = commands[i].replace("$ cd ", "");
            if (directory === "/") {
                currentDirectory = "";
            } else if (directory === "..") {
                const dirs = currentDirectory.split("/");
                dirs.pop();
                currentDirectory = dirs.join("/");
            } else {
                currentDirectory = `${currentDirectory}/${directory}`;
            }
        } else if (commands[i].match(/^\$ ls/g)) {
            // listing = true;
        } else if (commands[i].match(/^dir/g)) {
            // const directory = commands[i].replace('dir ');
            // // add directory to current directory
            // currentDirectory = {..., [directory]: {}}
        } else {
            const match = commands[i].match(/(\d+) (.*)/);
            const size = Number(match[1]);
            const filename = match[2];
            fileSystem.push({ file: `${currentDirectory}/${filename}`, size });
        }
    }

    // find directories
    const directories = _.uniq(
        fileSystem
            .map((listing) => {
                const match = listing.file.match(/^\/(\w+\/)+/g);
                if (!match) {
                    return null;
                }

                return match[0];
            })
            .filter((dir) => dir !== null)
    );

    const directoriesWithSize = directories.map((dir) => ({
        dir,
        size: getDirectorySize(dir),
    }));

    function getDirectorySize(directory) {
        let size = 0;

        // simple way
        const simpleWay = fileSystem.filter(file => file.file.includes(directory));

        // regex way
        const regexWay = fileSystem.filter((listing) => {
            const regex = new RegExp(`^${directory}`, "g");
            return listing.file.match(regex);
        });

        regexWay.forEach((file) => {
            size += file.size;
        });

        return size;
    }

    let answer = 0;

    // let's test if all files are present
    const numbers = puzzleInput
        .split("\n")
        .map((line) => line.match(/\d+/g))
        .filter((l) => l !== null)
        .map((s) => Number(s));

    // console.log(numbers.length);
    // console.log(fileSystem.length);

    numbers.forEach((number) => {
        const find = fileSystem.find((file) => file.size === number);

        // if (!find) {
        //     console.log('we lost a file!!!!');
        // } else {
        //     console.log('all files there');
        // }
    });

    // sum of below
    directoriesWithSize
        .filter((dir) => dir.size <= LIMIT)
        .forEach((dir) => {
            answer += dir.size;
        });

    // console.log(fileSystem.map(file => file.size).reduce((a, b) => a + b));
    // console.log(directoriesWithSize);

    return answer;
}
