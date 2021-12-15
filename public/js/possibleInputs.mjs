'use strict';

// All input values are between 0 and 1
export const possibleInputs = [
    {
        name: 'Slr',
        type: 'Pheromone',
        layer: 'Input',
        typeID: '0',
        action: (target, value) => {
            // Depends on this blocks grid position and the two blocks left and right of it

            // Look at blocks left and right to detect if there is a pheromone gradient between 0 and 1
            // If there is a gradient, multiply the gradient value by the weight and send it to the target neuron

            console.log('Slr');
        },
    }, // Pheromone gradient left-right
    {
        name: 'Sfd',
        type: 'Pheromone',
        typeID: '1',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position and the three blocks in front of it
            console.log('Sfd');
        },
    }, // Pheromone gradient forward
    {
        name: 'Sg',
        type: 'Pheromone',
        typeID: '2',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position
            console.log('Sg');
        },
    }, // Pheromone density
    {
        name: 'Age',
        type: 'Internal',
        typeID: '0',
        layer: 'Input',
        action: () => {
            // Output starts at 0 and ends at 1 when the lifetime (total number of steps) is up
            // Depends on number of steps (which need to be kept track of and have a finite amount of them to begin with)
            console.log('Age');
        },
    }, // Age
    {
        name: 'Rnd',
        type: 'Internal',
        typeID: '1',
        layer: 'Input',
        action: () => {
            // Not dependant on anything, just sends a random value between 0 and 1
            console.log('Rnd');
        },
    }, // Random input
    {
        name: 'Osc',
        type: 'Internal',
        typeID: '2',
        layer: 'Input',
        action: () => {
            // Frequency of full oscillation wave is default to 25 steps
            console.log('Osc');
        },
    }, // Oscillator
    {
        name: 'LMy',
        type: 'Internal',
        typeID: '3',
        layer: 'Input',
        action: () => {
            console.log('LMy');
        },
    }, // Last movement y
    {
        name: 'LMx',
        type: 'Internal',
        typeID: '4',
        layer: 'Input',
        action: () => {
            console.log('LMx');
        },
    }, // Last movement x
    {
        name: 'Blr',
        type: 'Environement',
        typeID: '0',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position and the two blocks left and right of it
            // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
            console.log('Blr');
        },
    }, // Blockage left-right
    {
        name: 'Bfd',
        type: 'Environement',
        typeID: '1',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position and the one block in front of it
            // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
            console.log('Bfd');
        },
    }, // Blockage forward
    {
        name: 'LBf',
        type: 'Environement',
        typeID: '2',
        layer: 'Input',
        action: () => {
            console.log('LBf');
        },
    }, // Blockage long-range forward
    {
        name: 'BDy',
        type: 'Environement',
        typeID: '3',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position
            console.log('DBy');
        },
    }, // North-South border distance
    {
        name: 'BDx',
        type: 'Environement',
        typeID: '4',
        layer: 'Input',
        action: () => {
            // Depends on this blocks grid position
            console.log('BDx');
        },
    }, // East-West border distance
    {
        name: 'Lx',
        type: 'Environement',
        typeID: '5',
        layer: 'Input',
        action: () => {
            // Depends on blocks grid coords
            console.log('Lx');
        },
    }, // East-West world location, value is position in world on x axis represented by float between 0 and 1
    {
        name: 'Ly',
        type: 'Environement',
        typeID: '6',
        layer: 'Input',
        action: () => {
            // Depends on blocks grid coords
            console.log('Ly');
        },
    }, // North-South world location, value is position in world on y axis represented by float between 0 and 1
    {
        name: 'BD',
        type: 'Environement',
        typeID: '7',
        layer: 'Input',
        action: () => {
            console.log('BD');
        },
    }, // Nearest border distance
    {
        name: 'Plr',
        type: 'Social',
        typeID: '0',
        layer: 'Input',
        action: () => {
            console.log('Plr');
        },
    }, // Population gradient left-right
    {
        name: 'Pfd',
        type: 'Social',
        typeID: '1',
        layer: 'Input',
        action: () => {
            // Depends on the grid position of the block and the three blocks in front of it
            // Output depends on the gradient of population density from its position through the three blocks in front of it
            console.log('Pfd');
        },
    }, // Population gradient forward
    {
        name: 'Pop',
        type: 'Social',
        typeID: '2',
        layer: 'Input',
        action: () => {
            // Depends on the grid position of the block and its immediate neighbours
            // The higher the population density, the higher the output
            console.log('Pop');
        },
    }, // Population density
    {
        name: 'LPf',
        type: 'Social',
        typeID: '3',
        layer: 'Input',
        action: () => {
            console.log('LPf');
        },
    }, // Population long-range forward
    {
        name: 'Gen',
        type: 'Social',
        typeID: '4',
        layer: 'Input',
        action: () => {
            // Depends on knowledge of the grid space one block in the forward direction
            // and knowlegde of the blocks brain if there is one present in that position
            console.log('Gen');
        },
    }, // Genetic similarity of forward neighbour
];
