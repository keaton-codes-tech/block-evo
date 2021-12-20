'use strict';

import { Block } from './blockClass.mjs';
import { uiTools } from './uiTools.mjs';

export const canvasTools = {
    population: [],
    grid: [],
    lineWidth: 1,
    blockWidth: 5,
    dimensions: 128,
    startingPopulation: 1000,
    numInputNeurons: 4,
    numHiddenNeurons: 2,
    numOutputNeurons: 2,
    stepRatePerSecond: 1000 / 20,
    stepCounter: 0,
    limitSteps: true,
    maxSteps: 200,
    pheromoneDecayRate: 1.3, // 30% decay per tick

    drawGrid: (ctx, dimensions, blockWidth) => {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = canvasTools.lineWidth;

        // loop through the number of rows
        for (let i = 0; i < dimensions; i++) {
            // loop through the number of columns
            for (let j = 0; j < dimensions; j++) {
                // draw a square
                ctx.strokeRect(
                    i * blockWidth,
                    j * blockWidth,
                    blockWidth,
                    blockWidth
                );
            }
        }
    },

    clearCanvas: (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    draw: (ctx) => {
        canvasTools.clearCanvas(ctx);

        // draw the objects
        uiTools.updateInfo(canvasTools.population.length);
        // canvasTools.drawGrid(
        //     ctx,
        //     canvasTools.dimensions,
        //     canvasTools.blockWidth
        // );
        canvasTools.drawBlocks(ctx);
        canvasTools.drawMouse(ctx);
    },

    paintBlock: (ctx, x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * canvasTools.blockWidth + canvasTools.lineWidth,
            y * canvasTools.blockWidth + canvasTools.lineWidth,
            canvasTools.blockWidth - canvasTools.lineWidth * 2,
            canvasTools.blockWidth - canvasTools.lineWidth * 2
        );
    },

    drawBlocks: (ctx) => {
        canvasTools.population.forEach((block) => {
            block.paint(ctx);
        });
    },

    drawMouse: (ctx) => {
        if (uiTools.mouse.x != null && uiTools.mouse.y != null) {
            const opacity = 0.3;
            canvasTools.paintBlock(
                ctx,
                uiTools.mouse.x,
                uiTools.mouse.y,
                `rgba(0, 0, 0, ${opacity})`
            );
            const selectedBlock = canvasTools.population.filter((block) => {
                if (
                    uiTools.mouse.x === block.x &&
                    uiTools.mouse.y === block.y
                ) {
                    return block;
                }
            });
            if (selectedBlock.length > 0) {
                if (uiTools.selectedBlock === null) {
                    uiTools.selectedBlock = selectedBlock[0];
                } else if (
                    selectedBlock[0].x !== uiTools.selectedBlock.x ||
                    selectedBlock[0].y !== uiTools.selectedBlock.y
                ) {
                    uiTools.selectedBlock = selectedBlock[0];
                }
            }
        }
    },

    // create a function that paints random blocks
    setRandomBlock: () => {
        // get a random number between 0 and the number of columns
        const x = Math.floor(Math.random() * canvasTools.dimensions);
        // get a random number between 0 and the number of rows
        const y = Math.floor(Math.random() * canvasTools.dimensions);
        canvasTools.population.push(
            new Block({
                x,
                y,
                numInputs: canvasTools.numInputNeurons,
                numHiddens: canvasTools.numHiddenNeurons,
                numOutputs: canvasTools.numOutputNeurons,
            })
        );
    },

    setRandomCoords: (block, population) => {
        const x = Math.floor(Math.random() * canvasTools.dimensions);
        const y = Math.floor(Math.random() * canvasTools.dimensions);
        // check if the position is occupied
        if (
            population.filter((b) => {
                if (b.x === x && b.y === y) {
                    return b;
                }
            }).length === 0
        ) {
            block.x = x;
            block.y = y;
        } else {
            canvasTools.setRandomCoords(block, population);
        }
    },

    setRandomBlocks: (ctx, numblocks) => {
        for (let i = 0; i < numblocks; i++) {
            canvasTools.setRandomBlock(ctx);
        }
    },

    processBlockActions: () => {
        if (canvasTools.limitSteps) {
            if (canvasTools.stepCounter < canvasTools.maxSteps) {
                canvasTools.stepCounter++;
                canvasTools.population.forEach((block) => {
                    block.processStep(canvasTools.grid, canvasTools.population);
                });
            } else {
                canvasTools.stepCounter = 0;
                canvasTools.makeSelections(canvasTools.population);
            }
        } else {
            canvasTools.population.forEach((block) => {
                block.processStep(canvasTools.grid, canvasTools.population);
            });
        }
        canvasTools.updateGrid();
        canvasTools.populateGrid();
    },

    makeSelections: (population) => {
        // basic selection criteria
        console.log('population', population);
        for (let index = population.length - 1; index >= 0; index--) {
            const block = population[index];
            console.log('block', block, 'index', index);
            if (block.x > canvasTools.dimensions / 2) {
                // remove the block from the population
                population.splice(index, 1);
            }
        }
        setTimeout(() => {canvasTools.asexualReproduction(population)}, 1000);
        
    },

    asexualReproduction: (population) => {
        const newPopulation = [];
        population.forEach((block) => {
            function makeNew(i) {
                --i;
                const newBlock = new Block({
                    x: block.x,
                    y: block.y,
                    brain: block.brain,
                });
                canvasTools.setRandomCoords(newBlock, newPopulation);
                newPopulation.push(newBlock);
                if (i > 0) {
                    makeNew(i - 1);
                }
            }
            makeNew(2);
        });
        // reduce new population amount to the starting population size
        if (newPopulation.length > canvasTools.startingPopulation) {
            newPopulation.splice(canvasTools.startingPopulation, newPopulation.length - canvasTools.startingPopulation);
        }
        canvasTools.population = newPopulation;
    },

    createGrid: () => {
        // Create two dimensional array
        canvasTools.grid = [];
        for (let i = 0; i < canvasTools.dimensions; i++) {
            canvasTools.grid[i] = [];
            for (let j = 0; j < canvasTools.dimensions; j++) {
                canvasTools.grid[i][j] = { pheromone: 0, occupant: null };
            }
        }
    },

    updateGrid: () => {
        // Remove occupants from grid and degrade pheromone
        for (let i = 0; i < canvasTools.dimensions; i++) {
            for (let j = 0; j < canvasTools.dimensions; j++) {
                canvasTools.grid[i][j].occupant = null;
                if (canvasTools.grid[i][j].pheromone > 0) {
                    canvasTools.grid[i][j].pheromone = parseFloat(
                        (
                            canvasTools.grid[i][j].pheromone /
                            canvasTools.pheromoneDecayRate
                        ).toFixed(2)
                    );
                }
            }
        }
    },

    populateGrid: () => {
        // Add occupants to grid
        canvasTools.population.forEach((block) => {
            canvasTools.grid[block.x][block.y].occupant = block;
        });
        //console.log(canvasTools.grid);
    },

    loop: (ctx, prevTime = 0) => {
        uiTools.debounce(
            'blockActions',
            canvasTools.processBlockActions,
            canvasTools.stepRatePerSecond
        );
        const now = Date.now();
        canvasTools.draw(ctx);
        uiTools.FPS = Math.round(1000 / (Date.now() - prevTime));
        window.requestAnimationFrame(() => canvasTools.loop(ctx, now));
    },
};
