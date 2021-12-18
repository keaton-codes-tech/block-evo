// Fun with evolving entities

// use strict mode
'use strict';

import { uiTools } from './uiTools.mjs';
import { canvasTools } from './canvasTools.mjs';

const init = () => {
    function initCanvas() {
        // create a canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        const ctx = canvas.getContext('2d');

        // set canvas size
        ctx.canvas.width = canvasTools.dimensions * canvasTools.blockWidth;
        ctx.canvas.height = canvasTools.dimensions * canvasTools.blockWidth;

        // insert the canvas into the DOM
        document.body.appendChild(canvas);

        // return the context
        return ctx;
    }
    const ctx = initCanvas();

    function initUIContainer() {
        // create a container for the UI
        const uiContainer = document.createElement('div');
        uiContainer.id = 'ui';

        // insert the container into the DOM
        document.body.appendChild(uiContainer);
        return uiContainer;
    }
    const uiContainer = initUIContainer();

    function initControlPanel() {
        function resizeCanvas() {
            ctx.canvas.width = canvasTools.dimensions * canvasTools.blockWidth;
            ctx.canvas.height = canvasTools.dimensions * canvasTools.blockWidth;
            resetCanvas();
        }
        function resetCanvas() {
            canvasTools.population.length = 0;
            canvasTools.setRandomBlocks(ctx, canvasTools.startingPopulation);
            canvasTools.createGrid();
            canvasTools.populateGrid();
        }
        // create a control panel container
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.className = 'panel';

        // create a dimensions input control
        const dimensionsInput = uiTools.createControlPanelElement({
            id: 'dimensions',
            label: 'Dimensions',
            type: 'number',
            value: '128',
            min: '8',
            max: '256',
            step: '1',
        });
        controlPanel.appendChild(dimensionsInput);
        // listen for changes to the dimensions input
        dimensionsInput.addEventListener('change', (e) => {
            canvasTools.dimensions = e.target.value;
            resizeCanvas();
        });

        // create a block width input control
        const blockWidthInput = uiTools.createControlPanelElement({
            id: 'block-width',
            label: 'Block Width',
            type: 'number',
            value: '5',
            min: '2',
            max: '100',
            step: '1',
        });
        controlPanel.appendChild(blockWidthInput);
        blockWidthInput.addEventListener('change', (e) => {
            canvasTools.blockWidth = e.target.value;
            resizeCanvas();
        });

        // create a number of starting population input control
        const startingPopInput = uiTools.createControlPanelElement({
            id: 'starting-population',
            label: 'Starting Population',
            type: 'number',
            value: '1000',
            min: '1',
            max: '5000',
            step: '1',
        });
        controlPanel.appendChild(startingPopInput);
        startingPopInput.addEventListener('change', (e) => {
            canvasTools.startingPopulation = e.target.value;
            resetCanvas();
        });

        // create a number of sensory(input) neurons input control
        const numInputNeurons = uiTools.createControlPanelElement({
            id: 'num-input-neurons',
            label: 'Input Neurons',
            type: 'number',
            value: '4',
            min: '1',
            max: '21',
            step: '1',
        });
        controlPanel.appendChild(numInputNeurons);
        numInputNeurons.addEventListener('change', (e) => {
            canvasTools.numInputNeurons = e.target.value;
            resetCanvas();
        });

        // create a number of hidden neurons input control
        const numHiddenNeurons = uiTools.createControlPanelElement({
            id: 'num-hidden-neurons',
            label: 'Hidden Neurons',
            type: 'number',
            value: '2',
            min: '1',
            max: '20',
            step: '1',
        });
        controlPanel.appendChild(numHiddenNeurons);
        numHiddenNeurons.addEventListener('change', (e) => {
            canvasTools.numHiddenNeurons = e.target.value;
            resetCanvas();
        });

        // create a number of output neurons input control
        const numOutputNeurons = uiTools.createControlPanelElement({
            id: 'num-output-neurons',
            label: 'Output Neurons',
            type: 'number',
            value: '2',
            min: '1',
            max: '6',
            step: '1',
        });
        controlPanel.appendChild(numOutputNeurons);
        numOutputNeurons.addEventListener('change', (e) => {
            canvasTools.numOutputNeurons = e.target.value;
            resetCanvas();
        });

        // create a step speed input control
        const stepSpeedControl = uiTools.createControlPanelElement({
            id: 'step-speed-control',
            label: 'Steps Per Second',
            type: 'number',
            value: '20',
            min: '1',
            max: '100',
            step: '1',
        });
        controlPanel.appendChild(stepSpeedControl);
        stepSpeedControl.addEventListener('change', (e) => {
            canvasTools.stepRatePerSecond = 1000 / e.target.value;
            resetCanvas();
        });

        // create a reset button
        const resetButton = uiTools.createControlPanelElement({
            id: 'reset',
            label: 'Reset',
            type: 'button',
            value: 'Click',
        });
        controlPanel.appendChild(resetButton);
        resetButton.addEventListener('click', () => {
            resetCanvas();
        });

        // insert the controls container into the DOM
        uiContainer.appendChild(controlPanel);
    }
    initControlPanel();

    function initInfoPanel() {
        // create an info panel container
        const infoPanel = document.createElement('div');
        infoPanel.id = 'info-panel';
        infoPanel.className = 'panel';

        const FPSinfo = uiTools.createInfoPanelElement({
            id: 'fpsinfo',
            label: 'FPS',
            value: '60',
        });
        infoPanel.appendChild(FPSinfo);

        const numBlocksInfo = uiTools.createInfoPanelElement({
            id: 'numblocks-info',
            label: 'Population',
            value: '',
        });
        infoPanel.appendChild(numBlocksInfo);

        // insert the info panel into the DOM
        uiContainer.appendChild(infoPanel);
    }
    initInfoPanel();

    function initBlockInfoPanel() {
        // create an info panel container
        const infoPanel = document.createElement('div');
        infoPanel.id = 'block-info-panel';
        infoPanel.className = 'panel';

        const blockX = uiTools.createInfoPanelElement({
            id: 'block-x-info',
            label: 'X',
            value: '',
        });
        infoPanel.appendChild(blockX);

        const blockY = uiTools.createInfoPanelElement({
            id: 'block-y-info',
            label: 'Y',
            value: '',
        });
        infoPanel.appendChild(blockY);

        const blockAge = uiTools.createInfoPanelElement({
            id: 'block-age-info',
            label: 'Age',
            value: '',
        });
        infoPanel.appendChild(blockAge);

        const blockColor = uiTools.createInfoPanelElement({
            id: 'block-color-info',
            label: 'Colour',
            value: '',
        });
        infoPanel.appendChild(blockColor);

        const blockDirection = uiTools.createInfoPanelElement({
            id: 'block-direction-info',
            label: 'Facing',
            value: '',
        });
        infoPanel.appendChild(blockDirection);

        // insert the info panel into the DOM
        uiContainer.appendChild(infoPanel);
    }
    initBlockInfoPanel();

    function initBrainInfoPanel() {
        // create an info panel container
        const infoPanel = document.createElement('div');
        infoPanel.id = 'brain-info-panel';
        infoPanel.className = 'panel';

        // insert the info panel into the DOM
        uiContainer.appendChild(infoPanel);
    }
    initBrainInfoPanel()

    function initMouseListener() {
        // listen for mouse events
        ctx.canvas.addEventListener('mousemove', (e) => {
            // get the mouse position
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            // get the block the mouse is over
            const blockX = Math.floor(mouseX / canvasTools.blockWidth);
            const blockY = Math.floor(mouseY / canvasTools.blockWidth);
            // paint the block
            uiTools.mouse.x = blockX;
            uiTools.mouse.y = blockY;
        });
    }
    initMouseListener();

    canvasTools.setRandomBlocks(ctx, canvasTools.startingPopulation);
    canvasTools.createGrid();
    canvasTools.populateGrid();

    // Begin the animation
    canvasTools.loop(ctx);
};

// run the init function when the page loads
window.onload = init;
