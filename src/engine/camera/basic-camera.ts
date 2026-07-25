import { vec3, mat4 } from "gl-matrix";
import type { Camera, CameraConfiguration, CameraRuntime, PerspectiveKind } from "../contracts/camera.contract";
import type { Position, Rotation } from "../core/primitives";

export interface BasicCameraOptions extends CameraConfiguration {
  type: "basic";
  perspective?: PerspectiveKind;
}

const defaultOptions = {
  perspective: "ortho",
  initialPlacement: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  },
} as const;

interface RequiredOptions {
  position: Position;
  rotation: Rotation;
  canvas: HTMLCanvasElement;
  perspective: PerspectiveKind;
}

/**
 * A basic camera
 */
export class BasicCamera implements Camera {
  #position: Position;
  #rotation: Rotation;
  #perspective: PerspectiveKind;

  #canvasElement: HTMLCanvasElement;

  #cameraMat: mat4;
  #orthoMat: mat4;
  #positionVec: vec3;
  #viewMat: mat4;
  #viewProjectionMat: mat4;
  #zoom: number;

  constructor(options: RequiredOptions) {
    const { canvas, position, rotation, perspective } = options;
    this.#position = position;
    this.#rotation = rotation;
    this.#perspective = perspective;
    this.#zoom = 1;

    this.#canvasElement = canvas;

    this.#cameraMat = mat4.create();
    this.#viewMat = mat4.create();
    this.#viewProjectionMat = mat4.create();
    this.#orthoMat = mat4.create();
    this.#positionVec = vec3.fromValues(this.#position.x, this.#position.y, this.#position.z);
  }

  static create(config: BasicCameraOptions, runtime: CameraRuntime) {
    const { initialPlacement, perspective } = config;
    return new BasicCamera({
      canvas: runtime.canvas,
      perspective: perspective ?? defaultOptions.perspective,
      position: { ...defaultOptions.initialPlacement.position, ...initialPlacement?.position },
      rotation: { ...defaultOptions.initialPlacement.rotation, ...initialPlacement?.rotation },
    });
  }

  get position() {
    return this.#position;
  }

  get perspective() {
    return this.#perspective;
  }

  get zoom() {
    return this.#zoom;
  }

  get #aspect() {
    return this.#canvasElement.clientWidth / this.#canvasElement.clientHeight;
  }

  setPosition(position: Position): void {
    this.#position.x = position.x;
    this.#position.y = position.y;
    this.#position.z = position.z;
    this.#updatePositionVector();
  }

  setRotation(rotation: Rotation): void {
    this.#rotation.rotateX = rotation.rotateX;
    this.#rotation.rotateY = rotation.rotateY;
    this.#rotation.rotateZ = rotation.rotateZ;
  }

  setZoom(amount: number): void {
    this.#zoom = amount;
  }

  getViewPerspective(): mat4 {
    if (this.#perspective === "perspective") {
      throw new Error("Not implemented");
    }

    const depth = 1000;

    const tilesAcross = 70 * this.#zoom;
    const halfW = tilesAcross / 2;
    const halfH = halfW / this.#aspect;

    this.#resetMats();

    this.#orthoMat = mat4.ortho(this.#orthoMat, -halfW, halfW, -halfH, halfH, -depth, depth);

    mat4.translate(this.#cameraMat, this.#cameraMat, this.#positionVec);
    mat4.rotateX(this.#cameraMat, this.#cameraMat, (this.#rotation.rotateX * Math.PI) / 180);
    mat4.rotateY(this.#cameraMat, this.#cameraMat, (this.#rotation.rotateY * Math.PI) / 180);
    mat4.rotateZ(this.#cameraMat, this.#cameraMat, (this.#rotation.rotateZ * Math.PI) / 180);

    this.#viewMat = mat4.invert(this.#viewMat, this.#cameraMat)!;
    this.#viewProjectionMat = mat4.multiply(this.#viewProjectionMat, this.#orthoMat, this.#viewMat);

    return this.#viewProjectionMat;
  }

  #resetMats() {
    mat4.identity(this.#orthoMat);
    mat4.identity(this.#viewMat);
    mat4.identity(this.#viewProjectionMat);
    mat4.identity(this.#cameraMat);
  }

  #updatePositionVector() {
    this.#positionVec = vec3.set(this.#positionVec, this.#position.x, this.#position.y, this.#position.z);
  }
}
