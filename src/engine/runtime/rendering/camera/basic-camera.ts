import { vec3, mat4 } from "gl-matrix";
import type { Position, Rotation } from "../../../contracts/spatial/spatial.contract";
import type { CameraConfiguration, PerspectiveKind, Camera, CameraConfigurationKind } from "../../../contracts/rendering/camera.contract";

export interface BasicCameraOptions extends CameraConfiguration {
  perspective?: PerspectiveKind;
}

const defaultOptions = {
  perspective: "ortho",
  initialPlacement: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
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

  static config(config: Omit<BasicCameraOptions, "type">): CameraConfigurationKind {
    const { initialPlacement, perspective } = config;
    return {
      type: "basic",
      perspective: perspective ?? defaultOptions.perspective,
      initialPlacement: {
        position: { ...defaultOptions.initialPlacement.position, ...initialPlacement?.position },
        rotation: { ...defaultOptions.initialPlacement.rotation, ...initialPlacement?.rotation },
      },
    };
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
    this.#rotation.x = rotation.x;
    this.#rotation.y = rotation.y;
    this.#rotation.z = rotation.z;
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
    mat4.rotateX(this.#cameraMat, this.#cameraMat, (this.#rotation.x * Math.PI) / 180);
    mat4.rotateY(this.#cameraMat, this.#cameraMat, (this.#rotation.y * Math.PI) / 180);
    mat4.rotateZ(this.#cameraMat, this.#cameraMat, (this.#rotation.z * Math.PI) / 180);

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
