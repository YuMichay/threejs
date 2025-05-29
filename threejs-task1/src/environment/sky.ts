import { CanvasTexture, LinearFilter } from 'three';

const gradientCanvas = document.createElement('canvas');
gradientCanvas.width = 1;
gradientCanvas.height = 256;

const ctx = gradientCanvas.getContext('2d') as CanvasRenderingContext2D;
const gradient = ctx.createLinearGradient(0, 0, 0, 256) as CanvasGradient;
gradient.addColorStop(0, '#77B4DB');
gradient.addColorStop(1, '#FFFFFF');

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1, 256);

export const backgroundTexture = new CanvasTexture(gradientCanvas);
backgroundTexture.magFilter = LinearFilter;
backgroundTexture.minFilter = LinearFilter;