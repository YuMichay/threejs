import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three';

const textureLoader = new TextureLoader();
const texture = textureLoader.load('/assets/collecting-line.png');
const material = new MeshBasicMaterial({ map: texture, transparent: true });
const geometry = new PlaneGeometry(2, 0.5);
export const collectLine = new Mesh(geometry, material);
collectLine.visible = false;
(collectLine.material as MeshBasicMaterial).depthWrite = false;
(collectLine.material as MeshBasicMaterial).depthTest = false;