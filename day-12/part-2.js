const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const START = "S";
const END = "E";
const DEFAULT = "a";

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    // keeping the options array, although I never ended up needing it
    const options = [puzzleInput.replace("S", "a")];

    return options.map(getShortestPathFromMap).sort((a, b) => a - b)[0];
}

function getShortestPathFromMap(puzzleInput) {
    const grid = puzzleInput.split("\n").map((row, rowIndex) =>
        row.split("").map((str, columnIndex) => {
            const isStart = str === START;
            let value = str;

            if (value === END) {
                value = "z";
            }

            return {
                value,
                visited: false,
                distance: value === "a" ? 0 : Infinity,
                rowIndex,
                columnIndex,
                endNode: str === END,
            };
        })
    );

    let currentNode = grid
        .reduce((a, b) => [...a, ...b])
        .filter((node) => !node.visited)
        .sort((a, b) => a.distance - b.distance)[0];

    while (currentNode) {
        const neighbours = getNeighbours(currentNode, grid);

        neighbours.forEach((neighbour) => {
            neighbour.distance = Math.min(
                neighbour.distance,
                currentNode.distance + 1
            );

            if (neighbour.value === "E") {
                console.error("andon cord");
            }
        });

        currentNode.visited = true;

        currentNode = grid
            .reduce((a, b) => [...a, ...b])
            .filter((node) => !node.visited)
            .sort((a, b) => a.distance - b.distance)[0];
    }

    return grid.reduce((a, b) => [...a, ...b]).find((node) => node.endNode)
        .distance;
}

function getNeighbours(currentNode, grid) {
    const row = currentNode.rowIndex;
    const column = currentNode.columnIndex;
    const up = getNode(row - 1, column, grid);
    const right = getNode(row, column + 1, grid);
    const down = getNode(row + 1, column, grid);
    const left = getNode(row, column - 1, grid);

    return [up, right, down, left]
        .filter((node) => node)
        .filter(
            (node) =>
                node.value.charCodeAt(0) - currentNode.value.charCodeAt(0) <= 1
        );
}

function getNode(row, column, grid) {
    if (!grid[row] || !grid[row][column]) {
        return null;
    }

    return grid[row][column];
}
