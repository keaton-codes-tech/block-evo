'use strict';

import { blockActionTools } from "./blockActionTools.mjs";

// all output values are between -1 and 1
export const possibleOutputs = [
    {
        name: 'SG',
        type: 'Pheromone',
        typeID: '3',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (value > 0) {
                if (probability(value)) {
                    grid[block.x][block.y].pheromone = 1;
                }
            }
        },
    }, // Emit pheromone, increase pheromone density by 0.5 on current grid position
    {
        name: 'OSC',
        type: 'Internal',
        typeID: '5',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, value }) => {
            // Not using probability here
            const oscillationIntervalMax = 1000;
            const oscillationIntervalMin = 3;
            let newVal = block.brain.oscillationInterval;
            if (value > 0) {
                newVal *= value + 1;
                if (newVal > oscillationIntervalMax) {
                    newVal = oscillationIntervalMax;
                }
            } else {
                newVal /= Math.abs(value) + 1;
                if (newVal < oscillationIntervalMin) {
                    newVal = oscillationIntervalMin;
                }
            }
            block.brain.oscillationInterval = newVal;
        },
    }, // Set oscillator period - increase or decrease the default period
    {
        name: 'Res',
        type: 'Internal',
        typeID: '6',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, value }) => {
            if (probability(Math.abs(value))) {
                let newVal;
                if (value > 0) {
                    newVal = block.brain.responsiveness + 0.1;
                } else {
                    newVal = block.brain.responsiveness - 0.1;
                }
                if (newVal < 0) {
                    newVal = 0;
                } else if (newVal > 1) {
                    newVal = 1;
                }
                block.brain.responsiveness = newVal;
            }
        },
    }, // Set responsiveness, increase or decrease the default responsiveness, lowers or raises the threshold probability of all input and output neurons firing
    {
        name: 'Mfd',
        type: 'Environement',
        typeID: '8',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                let newPos = resolveMovement('Forward', block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move forward (last direction of movement = forward)
    {
        name: 'Mrn',
        type: 'Environement',
        typeID: '9',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                const possibilities = ['Forward', 'Left-Right', 'Reverse'];
                const randomDirection = possibilities[Math.floor(Math.random() * possibilities.length)];
                const newPos = resolveMovement(randomDirection, block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move random
    {
        name: 'Mrv',
        type: 'Environement',
        typeID: '10',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                const newPos = resolveMovement('Reverse', block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move reverse
    {
        name: 'MLR',
        type: 'Environement',
        typeID: '11',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                const newPos = resolveMovement('Left-Right', block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move left-right (+/-)
    {
        name: 'MX',
        type: 'Environement',
        typeID: '12',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                const newPos = resolveMovement('East-West', block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move east-west (+/-)
    {
        name: 'MY',
        type: 'Environement',
        typeID: '13',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value }) => {
            if (probability(Math.abs(value))) {
                // Get the x and y coords of the intended movement
                const newPos = resolveMovement('North-South', block, value);

                // Check if new position is valid
                if (blockActionTools.isValidPosition(newPos, grid)) {
                    // If so, allow the movement
                    block.x = newPos.x;
                    block.y = newPos.y;
                }
            }
        },
    }, // Move north-south (+/-)
    {
        name: 'Kill',
        type: 'Social',
        typeID: '5',
        layer: 'Output',
        receivedValues: [],
        action: ({ block, grid, value, population }) => {
            if (value > 0) {
                if (probability(value)) {
                    const killPos = resolveMovement('Forward', block, value);
                    if (blockActionTools.isInsideGrid(killPos, grid) && blockActionTools.isPositionOccupied(killPos, grid)) {
                        let victim = grid[killPos.x][killPos.y].occupant;
                        console.log('Killing', victim);
                        // Remove occupant from the population
                        population.splice(population.indexOf(victim), 1);
                    }
                }
            }
        },
    }, // Kill forward neighbour
];

function probability(n) {
    return Math.random() < n;
}

function resolveMovement(intendedDirection, block, value) {
    let increment;
    let newPos = { x: block.x, y: block.y };
    if (value > 0) {
        increment = 1;
    } else {
        increment = -1;
    }

    if (intendedDirection === 'Forward') {
        if (block.direction === 'North') {
            newPos.y -= increment;
        } else if (block.direction === 'East') {
            newPos.x += increment;
        } else if (block.direction === 'South') {
            newPos.y += increment;
        } else if (block.direction === 'West') {
            newPos.x -= increment;
        }
    } else if (intendedDirection === 'Left-Right') {
        if (block.direction === 'North') {
            newPos.x -= increment;
        } else if (block.direction === 'East') {
            newPos.y += increment;
        } else if (block.direction === 'South') {
            newPos.x += increment;
        } else if (block.direction === 'West') {
            newPos.y -= increment;
        }
    } else if (intendedDirection === 'Reverse') {
        if (block.direction === 'North') {
            newPos.y += increment;
        } else if (block.direction === 'East') {
            newPos.x -= increment;
        } else if (block.direction === 'South') {
            newPos.y -= increment;
        } else if (block.direction === 'West') {
            newPos.x += increment;
        }
    } else if (intendedDirection === 'East-West') {
        newPos.x += increment;
    } else if (intendedDirection === 'North-South') {
        newPos.y += increment;
    }

    return newPos;
}
