import { NeuralNetwork } from "./neuralNetworkClass.mjs";
import { canvasTools } from "./canvasTools.mjs";

export class Block {
    constructor(x, y, color, numInputs, numHiddens, numOutputs) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.brain = new NeuralNetwork(numInputs, numHiddens, numOutputs);
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
}