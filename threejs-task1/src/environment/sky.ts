import { SphereGeometry, Mesh, MeshBasicMaterial, BackSide } from 'three';

const skyGeometry = new SphereGeometry(500, 32, 32);
const skyMaterial = new MeshBasicMaterial({ color: 0x87ceeb, side: BackSide });
export const sky = new Mesh(skyGeometry, skyMaterial);