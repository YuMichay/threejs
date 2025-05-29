import { Vector3 } from "three";

class KeyboardControl {
  w = false;
  s = false;
  a = false;
  d = false;
  f = false;
  e = false;
  esc = false;

  constructor() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch(event.code) {
      case "KeyW":
        this.w = true;
        break;
      case "KeyS":
        this.s = true;
        break;
      case "KeyA":
        this.a = true;
        break;
      case "KeyD":
        this.d = true;
        break;
      case "KeyF":
        this.f = true;
        break;
      case "Escape":
        this.esc = !this.esc;
        break;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    switch(event.code) {
      case "KeyW":
        this.w = false;
        break;
      case "KeyS":
        this.s = false;
        break;
      case "KeyA":
        this.a = false;
        break;
      case "KeyD":
        this.d = false;
        break;
      case "KeyF":
        this.f = false;
        break;
      case "KeyE":
        this.e = !this.e;
        break;
    }
  }

  get direction() {
    const x = -Number(this.a) + Number(this.d);
    const y = Number(this.w) + -Number(this.s);

    return new Vector3(x, y, 0).normalize();
  }
}

export const keyboardControl = new KeyboardControl();