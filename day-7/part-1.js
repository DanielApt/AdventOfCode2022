const fs = require("fs");
const _ = require("lodash");

const LIMIT = 100000;

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
// const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));

// console.log(main(puzzleInput));

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
        if (commands[i].indexOf("$ cd") !== -1) {
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
        } else if (commands[i].indexOf("$ ls") !== -1) {
            // listing = true;
        } else if (commands[i].indexOf("dir") !== -1) {
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
                const match = listing.file.match(/\/(\w\/)+/g);
                if (!match) {
                    return null;
                }

                return match[0];
                // listing.file.match(/\/(\w\/)+/g);
            })
            .filter((dir) => dir !== null)
    );

    const directoriesWithSize = directories.map((dir) => ({
        dir,
        size: getDirectorySize(dir),
    }));

    function getDirectorySize(directory) {
        let size = 0;
        fileSystem
            .filter((listing) => listing.file.includes(directory))
            .forEach((file) => {
                size += file.size;
            });

        return size;
    }

    // sum of below
    return Number(directoriesWithSize
        .filter((dir) => dir.size <= LIMIT)
        .reduce((a, b) => a.size + b.size));
}
