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
            let oscillationValue = parseFloat(Math.sin( 2 * Math.PI / block.brain.oscillationInterval * block.age ).toFixed(5));
            
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
            return Math.min(values); // return the lowest value
        },
    }, // Nearest border distance
    {
        name: 'Plr',
        type: 'Social',
        typeID: '0',
        layer: 'Input',
        action: ({block, grid}) => {
            const range = 1;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Left-Right', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid)) {
                    if (grid[pos.x][pos.y].occupant !== null) {
                        values.push(1);
                    } else {
                        values.push(0);
                    }
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
    }, // Population gradient left-right
    {
        name: 'Pfd',
        type: 'Social',
        typeID: '1',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on the grid position of the block and the three blocks in front of it
            // Output depends on the gradient of population density from its position through the three blocks in front of it
            const range = 1;
            const values = [];

            for (let i = -range; i <= range; i++) {
                if (i === 0) {
                    continue;
                }
                const pos = blockActionTools.resolveMovement('Forward', block, i, Math.abs(i));
                if (blockActionTools.isInsideGrid(pos, grid)) {
                    if (grid[pos.x][pos.y].occupant !== null) {
                        values.push(1);
                    } else {
                        values.push(0);
                    }                    
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
    }, // Population gradient forward
    {
        name: 'Pop',
        type: 'Social',
        typeID: '2',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on the grid position of the block and its immediate neighbours
            // The higher the population density, the higher the output
            // 8 squares to check
            // return 8 / squaresOccupied * 100 // percentage of squares occupied
            // fit to range 0-1
            let count = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    if (blockActionTools.isInsideGrid({x: block.x+i, y: block.y+j}, grid)) {
                        if (grid[block.x+i][block.y+j].occupant !== null) {
                            count++;
                        }                        
                    }
                }
            }
            count = 8 / count * 100;
            return blockActionTools.range(0, 100, 0, 1, count);
        },
    }, // Population density
    {
        name: 'LPf',
        type: 'Social',
        typeID: '3',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on the grid position of the block and the blocks in front of it all the way to the edge of the grid
            // Return 0 - 1
            // Check which heading is forward and count how many blocks are in front until the edge
            // values.push(block.x); // distance to West border
            // values.push(grid.length-1 - block.x); // distance to East border
            // values.push(block.y); // distance to North border
            // values.push(grid[0].length-1 - block.y); // distance to South border
            let values = [];
            let squaresInFront = 0;
            if (block.direction === 'North') {
                squaresInFront = block.y;
                if (squaresInFront > 0) {
                    for (let index = 1; index <= squaresInFront; index++) {
                        if (grid[block.x][block.y-index].occupant === null) {
                            values.push(0);
                        } else {
                            values.push(1);
                        }
                    }                    
                }
            } else if (block.direction === 'South') {
                squaresInFront = grid[0].length-1 - block.y;
                if (squaresInFront > 0) {
                    for (let index = 1; index <= squaresInFront; index++) {
                        if (grid[block.x][block.y+index].occupant === null) {
                            values.push(0);
                        } else {
                            values.push(1);
                        }
                    }                    
                }
            } else if (block.direction === 'East') {
                squaresInFront = block.x;
                if (squaresInFront > 0) {
                    for (let index = 1; index <= squaresInFront; index++) {
                        if (grid[block.x-index][block.y].occupant === null) {
                            values.push(0);
                        } else {
                            values.push(1);
                        }
                    }                    
                }
            } else if (block.direction === 'West') {
                squaresInFront = grid.length-1 - block.x;
                if (squaresInFront > 0) {
                    for (let index = 1; index <= squaresInFront; index++) {
                        if (grid[block.x+index][block.y].occupant === null) {
                            values.push(0);
                        } else {
                            values.push(1);
                        }
                    }                    
                }
            }
            const sumValues = values.reduce((a, b) => a + b, 0);
            let x = values.length / sumValues * 100;
            return blockActionTools.range(0, 100, 0, 1, x);
        },
    }, // Population long-range forward
    {
        name: 'Gen',
        type: 'Social',
        typeID: '4',
        layer: 'Input',
        action: ({block, grid}) => {
            // Depends on knowledge of the grid space one block in the forward direction
            // and knowlegde of the blocks brain if there is one present in that position
            // compare the color of this block to the color of the block in the forward direction to estimate genetic similarity
            // return a value between 0 and 1
            const pos = blockActionTools.resolveMovement('Forward', block, 1, 1);
            if (blockActionTools.isInsideGrid(pos, grid)) {
                const blockInFront = grid[pos.x][pos.y].occupant;
                if (blockInFront !== null) {
                    return blockActionTools.getSimilarity(block.color, blockInFront.color);
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        },
    }, // Genetic similarity of forward neighbour
];
