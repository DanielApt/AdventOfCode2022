const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

// 800 too low

const TOTAL_TIME = 30;

console.log(main(sampleInput));

console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const valves = {};
    puzzleInput.split("\n").forEach((line) => {
        const match = line.match(/Valve (\w+) .*=(\d+).* valves? (.*)/);
        const valve = match[1];
        const flowRate = Number(match[2]);
        const connections = match[3].split(", ");
        const open = false;

        valves[valve] = {
            name: valve,
            flowRate,
            connections,
            open,
        };
    });

    let minute = 0;

    let current = "AA";

    addPotential(current, minute);

    let target = current; // needed to prevent error, see if there's some other approach

    // get valve with highest potential
    for (const valve in valves) {
        target =
            valves[target].potential > valves[valve].potential ? target : valve;
    }

    console.log(target);

    let pressureReleased = 0;
    let currentFlowRate = 0;

    while (minute < TOTAL_TIME) {
        // move to the new target
        minute += valves[target].distance;
        // pressureReleased += currentFlowRate * valves[target].distance;
        pressureReleased += valves[target].pressureItCanRelease;
        current = target;

        // open the valve
        currentFlowRate += valves[current].flowRate;
        valves[current].flowRate = 0;
        valves[current].open = true;
        minute += 1; // we need 1 time to open valve
        // pressureReleased += currentFlowRate;

        // get a new target
        addPotential(current, minute);
        target = getNextTarget(current, minute);

        if (target === undefined) {
            pressureReleased += currentFlowRate * (TOTAL_TIME - minute);
            minute = TOTAL_TIME;
        }

        console.log(target);
    }

    console.log(pressureReleased);

    function addPotential(start, time, currentDistance = 0, visited = {}) {
        valves[start].distance = currentDistance;
        valves[start].potential = valves[start].flowRate - currentDistance;
        valves[start].pressureItCanRelease =
            valves[start].flowRate * (TOTAL_TIME - time - currentDistance);
        visited[start] = true;

        valves[start].connections.forEach((connection) => {
            if (!visited[connection]) {
                addPotential(connection, time, currentDistance + 1, visited);
            }
        });
    }

    function getNextTarget(current, minute) {
        const remaining = TOTAL_TIME - minute;

        const valveArray = [];

        for (const valve in valves) {
            valveArray.push(valves[valve]);
        }
        //     current =
        //         valves[current].pressureItCanRelease >
        //         valves[valve].pressureItCanRelease
        //             ? current
        //             : valve;
        // }

        const sorted = valveArray
            .filter((valve) => valve.distance < remaining)
            .sort((a, b) => b.pressureItCanRelease - a.pressureItCanRelease);

        if (!sorted.length) {
            return undefined;
        }

        return sorted[0].name;
    }

    return pressureReleased;
}
