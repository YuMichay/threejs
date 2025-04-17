import { MathUtils, Spherical, Vector3 } from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { effectController } from '../config/skyEffects';

export const sky = new Sky();
sky.scale.setScalar( 450000 );

const phi = MathUtils.degToRad( 90 - effectController.elevation );
const theta = MathUtils.degToRad( effectController.azimuth);
const spherical = new Spherical(1, phi, theta);
const sun = new Vector3().setFromSpherical(spherical);

const uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = effectController.turbidity;
uniforms[ 'rayleigh' ].value = effectController.rayleigh;
uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;
uniforms[ 'sunPosition' ].value.copy( sun );