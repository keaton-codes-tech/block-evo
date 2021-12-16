'use strict';

import { Block } from "./blockClass.mjs";
import { uiTools } from "./uiTools.mjs";

export const canvasTools = {
    population: [],
    grid: [],
    lineWidth: 1,
    blockWidth: 30,
    dimensions: 300,
    stepRatePerSecond: 3 * 1000,

    drawGrid: (ctx, dimensions, blockWidth) => {

        ctx.strokeStyle = 'black';
        ctx.lineWidth = canvasTools.lineWidth;

        // loop through the number of rows
        for (let i = 0; i < dimensions / blockWidth; i++) {
            // loop through the number of columns
            for (let j = 0; j < dimensions / blockWidth; j++) {
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
        canvasTools.drawGrid(ctx, canvasTools.dimensions, canvasTools.blockWidth);
        canvasTools.drawBlocks(ctx);
        canvasTools.drawMouse(ctx);
    },

    paintBlock: (ctx, x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * canvasTools.blockWidth + 1,
            y * canvasTools.blockWidth + 1,
            canvasTools.blockWidth - 2,
            canvasTools.blockWidth - 2
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
            canvasTools.paintBlock(ctx, uiTools.mouse.x, uiTools.mouse.y, `rgba(0, 0, 0, ${opacity})`);
            const selectedBlock = canvasTools.population.filter((block) => {
                if (uiTools.mouse.x === block.x && uiTools.mouse.y === block.y) {
                    return block;
                }
            });
            if (selectedBlock.length > 0) {
                if (uiTools.selectedBlock === null) {
                    uiTools.selectedBlock = selectedBlock[0];
                } else if (selectedBlock[0].x !== uiTools.selectedBlock.x || selectedBlock[0].y !== uiTools.selectedBlock.y) {
                    uiTools.selectedBlock = selectedBlock[0];
                }
            }
        }
    },

    // create a function that paints random blocks
    setRandomBlock: () => {
        // get a random number between 0 and the number of columns
        const x = Math.floor((Math.random() * canvasTools.dimensions) / canvasTools.blockWidth);
        // get a random number between 0 and the number of rows
        const y = Math.floor((Math.random() * canvasTools.dimensions) / canvasTools.blockWidth);
        canvasTools.population.push(new Block(x, y, 4, 2, 2));
    },

    setRandomBlocks: (ctx, numblocks) => {
        for (let i = 0; i < numblocks; i++) {
            canvasTools.setRandomBlock(ctx);
        }
    },

    processBlockActions: () => {
        canvasTools.population.forEach((block) => {
            block.processStep();
        });
        canvasTools.updateGrid();
        canvasTools.populateGrid();
    },

    createGrid: () => {
        // Create two dimensional array
        for (let i = 0; i < canvasTools.dimensions / canvasTools.blockWidth; i++) {
            canvasTools.grid[i] = [];
            for (let j = 0; j < canvasTools.dimensions / canvasTools.blockWidth; j++) {
                canvasTools.grid[i][j] = {pheromone: 0, occupant: null};
            }
        }
    },

    updateGrid: () => {
        // Create two dimensional array
        for (let i = 0; i < canvasTools.dimensions / canvasTools.blockWidth; i++) {
            for (let j = 0; j < canvasTools.dimensions / canvasTools.blockWidth; j++) {
                canvasTools.grid[i][j].occupant = null;
                canvasTools.grid[i][j].pheromone /= 1.3; // decay pheromone by 30%
            }
        }
    },

    populateGrid: () => {
        canvasTools.population.forEach((block) => {
            canvasTools.grid[block.x][block.y].occupant = block;
        });
        console.log(canvasTools.grid);
    },

    loop: (ctx, prevTime = 0) => {
        uiTools.debounce('blockActions', canvasTools.processBlockActions, canvasTools.stepRatePerSecond);
        const now = Date.now();
        canvasTools.draw(ctx);
        uiTools.FPS = Math.round(1000 / (Date.now() - prevTime));
        window.requestAnimationFrame(() => canvasTools.loop(ctx, now));
    },
};



