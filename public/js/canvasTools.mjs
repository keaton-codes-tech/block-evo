'use strict';

import { Block } from './blockClass.mjs';
import { uiTools } from './uiTools.mjs';

export const canvasTools = {
    population: [],
    grid: [],
    lineWidth: 1,
    blockWidth: 20,
    dimensions: 30,
    startingPopulation: 1,
    stepRatePerSecond: 3 * 1000,
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
        uiTools.updateInfo();
        canvasTools.drawGrid(
            ctx,
            canvasTools.dimensions,
            canvasTools.blockWidth
        );
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
        canvasTools.population.push(new Block(x, y, 4, 2, 2));
    },

    setRandomBlocks: (ctx, numblocks) => {
        for (let i = 0; i < numblocks; i++) {
            canvasTools.setRandomBlock(ctx);
        }
    },

    processBlockActions: () => {
        canvasTools.population.forEach((block) => {
            block.processStep(canvasTools.grid);
        });
        canvasTools.updateGrid();
        canvasTools.populateGrid();
    },

    createGrid: () => {
        // Create two dimensional array
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
                    console.log(
                        'before decay',
                        canvasTools.grid[i][j].pheromone
                    );
                    canvasTools.grid[i][j].pheromone = parseFloat(
                        (
                            canvasTools.grid[i][j].pheromone /
                            canvasTools.pheromoneDecayRate
                        ).toFixed(2)
                    );
                    console.log(
                        'after decay',
                        canvasTools.grid[i][j].pheromone
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
        console.log(canvasTools.grid);
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
