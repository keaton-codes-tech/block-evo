'use strict';

import { Block } from "./blockClass.mjs";
import { uiTools } from "./uiTools.mjs";

export const canvasTools = {
    population: [],
    lineWidth: 1,
    blockWidth: 30,
    dimensions: 300,
    stepRatePerSecond: 3 * 1000,
    // create a function that draws a grid of blocks
    drawGrid: (ctx, dimensions, blockWidth) => {
        // set the stroke color
        ctx.strokeStyle = 'black';

        // set the line width
        ctx.lineWidth = canvasTools.lineWidth;

        // loop through the number of rows
        for (let i = 0; i < dimensions / blockWidth; i++) {
            // loop through the number of columns
            for (let j = 0; j < dimensions / blockWidth; j++) {
                // draw a square grid
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
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    draw: (ctx) => {
        // clear the canvas
        canvasTools.clearCanvas(ctx);

        // draw the objects
        uiTools.updateInfo();
        canvasTools.drawGrid(ctx, canvasTools.dimensions, canvasTools.blockWidth);
        canvasTools.drawBlocks(ctx);
        canvasTools.drawMouse(ctx);
    },

    // create a function that paints a block with a colour
    paintBlock: (ctx, x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * canvasTools.blockWidth + 1,
            y * canvasTools.blockWidth + 1,
            canvasTools.blockWidth - 2,
            canvasTools.blockWidth - 2
        );
    },

    // draw the blocks
    drawBlocks: (ctx) => {
        canvasTools.population.forEach((block) => {
            block.paint(ctx);
        });
    },

    // draw the mouse
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
        // add the block to the array
        canvasTools.population.push(new Block(x, y, 4, 2, 2));
    },

    // create a function that returns a random colour
    // getRandomColor: () => {
    //     // create a random number between 0 and 255
    //     const r = Math.floor(Math.random() * 256);
    //     // create a random number between 0 and 255
    //     const g = Math.floor(Math.random() * 256);
    //     // create a random number between 0 and 255
    //     const b = Math.floor(Math.random() * 256);
    //     // return the colour
    //     return `rgb(${r}, ${g}, ${b})`;
    // },

    setRandomBlocks: (ctx, numblocks) => {
        // loop through the number of blocks
        for (let i = 0; i < numblocks; i++) {
            canvasTools.setRandomBlock(ctx);
        }
    },

    processBlockActions: () => {
        canvasTools.population.forEach((block) => {
            block.brain.processStep();
        });
    },

    loop: (ctx, prevTime = 0) => {
        uiTools.debounce('blockActions', canvasTools.processBlockActions, canvasTools.stepRatePerSecond);
        const now = Date.now();
        canvasTools.draw(ctx);
        uiTools.FPS = Math.round(1000 / (Date.now() - prevTime));
        window.requestAnimationFrame(() => canvasTools.loop(ctx, now));
    },
};



