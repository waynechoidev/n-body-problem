import { vec2, vec3, mat4 } from "@external/glmatrix/index";
import { toRadian } from "@external/glmatrix/common.js";

export default class Camera {
  private _position: vec3;
  private _center: vec3;
  private _up: vec3;
  private _rotate: vec2;

  private _isMobile: boolean;
  private _isDragging: boolean;
  private _initialX: number;
  private _initialY: number;

  constructor({
    position,
    center,
    up,
  }: {
    position: vec3;
    center: vec3;
    up: vec3;
  }) {
    this._position = position;
    this._center = center;
    this._up = up;
    this._rotate = vec2.fromValues(0, 0);

    this._isDragging = false;
    this._initialX = 0;
    this._initialY = 0;

    this._isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    this.initializeEvent();
  }

  get position() {
    const viewRotationMatrix = this.getViewRotationMatrix();
    const position = vec3.create();
    vec3.transformMat4(position, this._position, viewRotationMatrix);

    return position;
  }

  public getViewMatrix() {
    const view = mat4.create();

    const viewRotationMatrix = this.getViewRotationMatrix();

    const eye = vec3.create();
    const center = vec3.create();
    const up = vec3.create();
    vec3.transformMat4(eye, this._position, viewRotationMatrix);
    vec3.transformMat4(center, this._center, viewRotationMatrix);
    vec3.transformMat4(up, this._up, viewRotationMatrix);
    mat4.lookAt(view, eye, center, up);

    return view;
  }

  private initializeEvent() {
    const startEvent = this._isMobile ? "touchstart" : "mousedown";
    const moveEvent = this._isMobile ? "touchmove" : "mousemove";
    const endEvent = this._isMobile ? "touchend" : "mouseup";

    document.addEventListener(startEvent, (e) => {
      this._isDragging = true;
      this._initialX = this._isMobile
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      this._initialY = this._isMobile
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;
    });

    document.addEventListener(moveEvent, (e) => {
      if (this._isDragging) {
        const currentX = this._isMobile
          ? (e as TouchEvent).touches[0].clientX
          : (e as MouseEvent).clientX;
        const currentY = this._isMobile
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY;

        const dx = currentX - this._initialX;
        const dy = currentY - this._initialY;

        this._rotate = vec2.add(
          this._rotate,
          this._rotate,
          vec2.fromValues(dy / 10, dx / 10)
        );

        this._initialX = currentX;
        this._initialY = currentY;

        e.preventDefault();
      }
    });

    document.addEventListener(endEvent, () => {
      this._isDragging = false;
    });
  }

  private getViewRotationMatrix() {
    const viewRotationMatrix = mat4.create();
    mat4.rotateY(
      viewRotationMatrix,
      viewRotationMatrix,
      toRadian(this._rotate[1])
    );
    mat4.rotateX(
      viewRotationMatrix,
      viewRotationMatrix,
      toRadian(this._rotate[0])
    );
    return viewRotationMatrix;
  }
}
