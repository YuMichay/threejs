import { renderer } from "../base/renderer";

export const effectController = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.7,
  elevation: 2,
  azimuth: 180,
  exposure: renderer.toneMappingExposure
};