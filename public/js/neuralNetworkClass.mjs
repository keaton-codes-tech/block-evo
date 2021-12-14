import { neuralNetworkTools } from './neuralNetworkTools.mjs';

export class NeuralNetwork {
    constructor(numInputs, numHiddens, numOutputs) {
        this.input = neuralNetworkTools.getRandomInputs(numInputs);
        this.hidden = neuralNetworkTools.getHiddens(numHiddens);
        this.output = neuralNetworkTools.getRandomOutputs(numOutputs);
        this.weights_ih = neuralNetworkTools.getRandomWeights(
            this.input,
            this.hidden
        );
        this.weights_ho = neuralNetworkTools.getRandomWeights(
            this.hidden,
            this.output
        );
    }
    processActions() {
        // feed forward
        // inputs produce a number between 0 and 1
        // inputs multiply their value with their weights and send the result to the hidden layer
        // hidden layer produces a number between -1 and 1 with tanh(sum(inputs))
        // outputs produce a number between -1 and 1 with tanh(sum(hidden))
        // outputs final values are the probabilities of the actions being taken negative or positive
        // this must happen each step and becomes the behaviour of the agent

        function probability(n) {
            return Math.random() < n;
        }
        for (const inputNeuronLabel in this.weights_ih) {
            for (const hiddenNeuronLabel in this.weights_ih[inputNeuronLabel]) {
                if (
                    probability(
                        Math.abs(
                            this.weights_ih[inputNeuronLabel][hiddenNeuronLabel]
                        )
                    )
                ) {
                    const thisInput = this.input.filter(
                        (entry) => entry.name === inputNeuronLabel
                    );
                    thisInput[0].action({
                        target: hiddenNeuronLabel,
                        value: this.weights_ih[inputNeuronLabel][
                            hiddenNeuronLabel
                        ],
                    });
                }
            }
        }
    }
    evolveGenome() {
        // mutate the weights
        this.weights_ih = neuralNetworkTools.mutateWeights(
            this.weights_ih,
            0.1
        );
        this.weights_ho = neuralNetworkTools.mutateWeights(
            this.weights_ho,
            0.1
        );
    }
}
