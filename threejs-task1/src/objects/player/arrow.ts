import { ArrowHelper, Vector3 } from "three";

export const createArrowHelper = () => {
  const direction = new Vector3();
  const origin = new Vector3( 0, 0, 0 );
  const length = 1.5;
  const hex = 0xffff00;
  const arrowHelper = new ArrowHelper( direction, origin, length, hex );

  return {
    arrowHelper,
    render(direction: Vector3) {
      arrowHelper.setDirection(direction);
    }
  }
}