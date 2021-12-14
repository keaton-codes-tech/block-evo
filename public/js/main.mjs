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
        ctx.canvas.width = canvasTools.dimensions;
        ctx.canvas.height = canvasTools.dimensions;

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
        // create a control panel container
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.className = 'panel';

        // create a dimensions input control
        const dimensionsInput = uiTools.createControlPanelElement({
            id: 'dimensions',
            label: 'Dimensions',
            type: 'number',
            value: '300',
            min: '10',
            max: '1000',
            step: '10',
        });
        controlPanel.appendChild(dimensionsInput);
        // listen for changes to the dimensions input
        dimensionsInput.addEventListener('change', (e) => {
            canvasTools.dimensions = e.target.value;
            // resize the canvas
            ctx.canvas.width = canvasTools.dimensions;
            ctx.canvas.height = canvasTools.dimensions;
        });

        // create a block width input control
        const blockWidthInput = uiTools.createControlPanelElement({
            id: 'block-width',
            label: 'Block Width',
            type: 'number',
            value: '30',
            min: '10',
            max: '100',
            step: '1',
        });
        controlPanel.appendChild(blockWidthInput);
        blockWidthInput.addEventListener('change', (e) => {
            canvasTools.blockWidth = e.target.value;
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
            canvasTools.population.length = 0;
            canvasTools.setRandomBlocks(ctx, 5);
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

        const blockColor = uiTools.createInfoPanelElement({
            id: 'block-color-info',
            label: 'Colour',
            value: '',
        });
        infoPanel.appendChild(blockColor);

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

    canvasTools.setRandomBlocks(ctx, 1);

    // Begin the animation
    canvasTools.loop(ctx);
};

// run the init function when the page loads
window.onload = init;
