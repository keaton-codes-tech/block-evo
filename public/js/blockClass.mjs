import { NeuralNetwork } from "./neuralNetworkClass.mjs";
import { canvasTools } from "./canvasTools.mjs";
import { neuralNetworkTools } from "./neuralNetworkTools.mjs";

export class Block {
    constructor(x, y, numInputs, numHiddens, numOutputs) {
        this.x = x;
        this.y = y;
        this.brain = new NeuralNetwork(numInputs, numHiddens, numOutputs);
        this.color = neuralNetworkTools.generateColorFromGenome(this.brain.connections);
        this.direction = neuralNetworkTools.getRandomDirection();
        this.age = 0;
        this.LMx = 0;
        this.LMy = 0;
    }
    paint(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * canvasTools.blockWidth + canvasTools.lineWidth,
            this.y * canvasTools.blockWidth + canvasTools.lineWidth,
            canvasTools.blockWidth - canvasTools.lineWidth * 2,
            canvasTools.blockWidth - canvasTools.lineWidth * 2
        );
    }
    processStep(grid, population) {
        this.age++;
        this.brain.processInputActions(this, grid);
        this.brain.feedForward();
        this.brain.processOutputActions(this, grid, population);
    }
}