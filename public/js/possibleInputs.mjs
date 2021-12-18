'use strict';

import { blockActionTools } from "./blockActionTools.mjs";

// All input values are between 0 and 1 *** CONSIDER CHANGING THIS *** could be better with -1 to 1 range
export const possibleInputs = [
    {
        name: 'Slr',
        type: 'Pheromone',
        layer: 'Input',
        typeID: '0',
        action: ({block, grid}) => {
            // Depends on this blocks grid position and the three blocks left and right of it
            const range = 3;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Left-Right', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid)) {
                    values.push(grid[pos.x][pos.y].pheromone);
                } else {
                    values.push(0);
                }
            }

            // Gradient can range from -0.5 to 0.5
            const gradient = blockActionTools.getGradient(values);
            // Change the gradient to be between -1 and 1
            const adjustedGradient = blockActionTools.range(-0.5, 0.5, -1, 1, gradient);

            return adjustedGradient;
        },
    }, // Pheromone gradient left-right (smell)
    {
        name: 'Sfd',
        type: 'Pheromone',
        typeID: '1',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position and the three blocks in front of it
            const range = 3;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Forward', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid)) {
                    values.push(grid[pos.x][pos.y].pheromone);
                } else {
                    values.push(0);
                }
            }

            // Gradient can range from -0.5 to 0.5
            const gradient = blockActionTools.getGradient(values);
            // Change the gradient to be between -1 and 1
            const adjustedGradient = blockActionTools.range(-0.5, 0.5, -1, 1, gradient);

            return adjustedGradient;
        },
    }, // Pheromone gradient forward-reverse (smell)
    {
        name: 'Sg',
        type: 'Pheromone',
        typeID: '2',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position
            
            return grid[block.x][block.y].pheromone;
        },
    }, // Pheromone density
    {
        name: 'Age',
        type: 'Internal',
        typeID: '0',
        layer: 'Input',
        action: ({block}) => {
            // Output starts at 0 and ends at 1 when the lifetime (total number of steps) is up
            // Depends on number of steps (which need to be kept track of and have a finite amount of them to begin with)
            // - OR - maybe when block age === lifetime (block dies of old age)
            //console.log('Age');
            // TODO: create lifetime variable
            return block.age;
        },
    }, // Age
    {
        name: 'Rnd',
        type: 'Internal',
        typeID: '1',
        layer: 'Input',
        action: () => {
            // Not dependant on anything, just sends a random value between 0 and 1
            return Math.random();
        },
    }, // Random input
    {
        name: 'Osc',
        type: 'Internal',
        typeID: '2',
        layer: 'Input',
        action: ({block}) => {
            // Frequency of full oscillation wave is default to 25 steps and can be changed by an output
            let oscillationValue = parseFloat(Math.sin( block.age * Math.PI / block.brain.oscillationInterval*2 ).toFixed(5));
            return oscillationValue;
        },
    }, // Oscillator
    {
        name: 'LMy',
        type: 'Internal',
        typeID: '3',
        layer: 'Input',
        action: ({block}) => {
            // If last moved south, will return 1
            // If last moved north, will return -1
            return block.LMy;
        },
    }, // Last movement y
    {
        name: 'LMx',
        type: 'Internal',
        typeID: '4',
        layer: 'Input',
        action: ({block}) => {
            // If last moved east, will return 1
            // If last moved west, will return -1
            return block.LMx;
        },
    }, // Last movement x
    {
        name: 'Blr',
        type: 'Environement',
        typeID: '0',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position and the block left and right of it
            // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
            const range = 1;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Left-Right', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid) && grid[pos.x][pos.y].occupant === null) {
                    values.push(0);
                } else {
                    values.push(1);
                }
            }

            // Gradient can range from -0.5 to 0.5
            const gradient = blockActionTools.getGradient(values);
            // Change the gradient to be between -1 and 1
            const adjustedGradient = blockActionTools.range(-0.5, 0.5, -1, 1, gradient);
            
            return adjustedGradient;
        },
    }, // Blockage left-right
    {
        name: 'Bfd',
        type: 'Environement',
        typeID: '1',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position and the one block in front of it
            // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
            const range = 1;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Forward', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid) && grid[pos.x][pos.y].occupant === null) {
                    values.push(0);
                } else {
                    values.push(1);
                }
            }

            // Gradient can range from -0.5 to 0.5
            const gradient = blockActionTools.getGradient(values);
            // Change the gradient to be between -1 and 1
            const adjustedGradient = blockActionTools.range(-0.5, 0.5, -1, 1, gradient);
            
            return adjustedGradient;
        },
    }, // Blockage forward
    {
        name: 'LBf',
        type: 'Environement',
        typeID: '2',
        layer: 'Input',
        action: ({block, grid}) => {
            const range = 3;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Forward', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid) && grid[pos.x][pos.y].occupant === null) {
                    values.push(0);
                } else {
                    values.push(1);
                }
            }

            // Gradient can range from -0.5 to 0.5
            const gradient = blockActionTools.getGradient(values);
            // Change the gradient to be between -1 and 1
            const adjustedGradient = blockActionTools.range(-0.5, 0.5, -1, 1, gradient);
            
            return adjustedGradient;
        },
    }, // Blockage long-range forward
    {
        name: 'BDy',
        type: 'Environement',
        typeID: '3',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position
            // ??? TODO: ???
            let adjustedPos = block.y / grid[0].length-1 * 100;
            adjustedPos = blockActionTools.range(0, 100, -1, 1, adjustedPos);

            return adjustedPos;
        },
    }, // North-South border distance
    {
        name: 'BDx',
        type: 'Environement',
        typeID: '4',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on this blocks grid position
            // ??? TODO: ???
            let adjustedPos = block.x / grid.length-1 * 100;
            adjustedPos = blockActionTools.range(0, 100, -1, 1, adjustedPos);

            return adjustedPos;
        },
    }, // East-West border distance
    {
        name: 'Lx',
        type: 'Environement',
        typeID: '5',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on blocks grid coords
            // Percentage of the way from the left to the right of the grid
            let adjustedPos = block.x / grid.length-1 * 100;
            adjustedPos = blockActionTools.range(0, 100, -1, 1, adjustedPos);

            return adjustedPos;
        },
    }, // East-West world location, value is position in world on x axis represented by float between 0 and 1
    {
        name: 'Ly',
        type: 'Environement',
        typeID: '6',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on blocks grid coords
            // Percentage of the way from the top to the bottom of the grid
            let adjustedPos = block.y / grid[0].length-1 * 100;
            adjustedPos = blockActionTools.range(0, 100, -1, 1, adjustedPos);

            return adjustedPos;
        },
    }, // North-South world location, value is position in world on y axis represented by float between 0 and 1
    {
        name: 'BD',
        type: 'Environement',
        typeID: '7',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on blocks grid coords
            const values = [];
            values.push(block.x); // distance to West border
            values.push(grid.length-1 - block.x); // distance to East border
            values.push(block.y); // distance to North border
            values.push(grid[0].length-1 - block.y); // distance to South border
            return Math.min(values);
        },
    }, // Nearest border distance
    {
        name: 'Plr',
        type: 'Social',
        typeID: '0',
        layer: 'Input',
        action: ({block, grid}) => {
            //console.log('Plr');
            return Math.random();
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
            //console.log('Pfd');
            return Math.random();
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
            //console.log('Pop');
            return Math.random();
        },
    }, // Population density
    {
        name: 'LPf',
        type: 'Social',
        typeID: '3',
        layer: 'Input',
        action: () => {
            //console.log('LPf');
            return Math.random();
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
            //console.log('Gen');
            return Math.random();
        },
    }, // Genetic similarity of forward neighbour
];
