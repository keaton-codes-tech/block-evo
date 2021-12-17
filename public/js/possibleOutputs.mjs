'use strict';

// all output values are between -1 and 1
export const possibleOutputs = [
    {
        name: 'SG',
        type: 'Pheromone',
        typeID: '3',
        layer: 'Output',
        receivedValues: [],
        action: ({block, grid, value}) => {
            console.log('SG before probability', value);
            if (value > 0) {
                if (probability(value)) {
                    console.log('SG activated: ', block.x, block.y);
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
        action: ({block, value}) => {
            if (value > 0) {
                block.oscillator *= value + 1;
            } else {
                block.oscillator /= Math.abs(value) + 1;
            }
        },
    }, // Set oscillator period - increase or decrease the default period
    {
        name: 'Res',
        type: 'Internal',
        typeID: '6',
        layer: 'Output',
        receivedValues: [],
        action: ({block, value}) => {
            let newVal;
            if (value > 0) {
                newVal = block.responsiveness += 0.1;
            } else {
                newVal = block.responsiveness -= 0.1;
            }
            if (newVal < 0) {
                newVal = 0;
            } else if (newVal > 1) {
                newVal = 1;
            }
            block.responsiveness = newVal;
        },
    }, // Set responsiveness, increase or decrease the default responsiveness, lowers or raises the threshold probability of all input and output neurons firing
    {
        name: 'Mfd',
        type: 'Environement',
        typeID: '8',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Move forward (last direction of movement = forward)
    {
        name: 'Mrn',
        type: 'Environement',
        typeID: '9',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Move random
    {
        name: 'Mrv',
        type: 'Environement',
        typeID: '10',
        layer: 'Output',
        receivedValues: [],
        action: () => {

        },
    }, // Move reverse
    {
        name: 'MRL',
        type: 'Environement',
        typeID: '11',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Move left-right (+/-)
    {
        name: 'MX',
        type: 'Environement',
        typeID: '12',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Move east-west (+/-)
    {
        name: 'MY',
        type: 'Environement',
        typeID: '13',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Move north-south (+/-)
    {
        name: 'Kill',
        type: 'Social',
        typeID: '5',
        layer: 'Output',
        receivedValues: [],
        action: () => {},
    }, // Kill forward neighbour
];

function probability(n) {
    return Math.random() < n;
}