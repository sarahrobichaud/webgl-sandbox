import { canvasToDisplaySizeMap, measureElement } from "../canvas/canvas-utils";
import { shaders } from "./shaders/basic-shader";
import { mat4, vec3 } from "gl-matrix";
import { position, transform3D, type Position, type Transform3D } from "../../core/primitives";
import { AreoGL } from "./webgl-lib/areo-gl";
import type { AreoProgram, LoadedMesh, Mesh } from "./webgl-lib/areo-types";
import type { Renderer3D, Viewport } from "../types";
import { gridShaders } from "./shaders/grid-shader";
import { MESHES } from "../shapes/mesh";

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #gl: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #programs: Record<string, AreoProgram> = {};
  #aero: AreoGL;

  #gridMesh = MESHES.plane;

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.#bootstrap(parentElement);

    this.#gl = canvas.getContext("webgl2")!;
    this.#canvas = canvas;
    this.#aero = new AreoGL(this.#gl);

    this.#programs.basic = this.#aero.createProgram("basic", shaders);
    this.#programs.grid = this.#aero.createProgram("grid", gridShaders);

    const resizeCallback = (entries: ResizeObserverEntry[]) => {
      measureElement(entries);
      this.#resizeCanvasToDisplaySize();
      this.#gl.viewport(0, 0, this.#gl.canvas.width, this.#gl.canvas.height);
    };

    const observer = new ResizeObserver(resizeCallback);
    this.#watchResize(observer);
  }

  get viewport() {
    return this.#viewport;
  }

  clear() {
    this.#gl.enable(this.#gl.DEPTH_TEST);
    this.#gl.clearColor(0, 0, 0, 0);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
  }

  init(meshes: Mesh[]): void {
    this.#aero.loadGeometry(this.#programs.basic, [
      this.#gridMesh,
    ]);
    this.#aero.loadGeometry(this.#programs.grid, meshes);
  }

  setStaticUniforms() {
    const uni = this.#programs.basic.sharedUniforms;

    const values = {
      u_color: [
        1, 0, 0.4,
        1,
      ],
      u_lightDirection: vec3.normalize(vec3.create(), vec3.fromValues(1000, -800, -800)),
    };
    this.#gl.uniform4fv(uni.u_color.location, values.u_color);
    this.#gl.uniform3fv(uni.u_reverseLightDirection.location, values.u_lightDirection);
  }

  #position = position(0, 200, 0);
  #transform = transform3D(0, 0, 0, 90, 0, 0, 5000, 1000, 1);

  renderGrid() {
    this.#gl.useProgram(this.#programs.grid.program);

    if (!this.#gridMesh.r_vao) {
      throw new Error("Grid Mesh not loaded");
    }

    this.#gl.bindVertexArray(this.#gridMesh.r_vao);

    const { worldViewProjection } = this.#computeDynamicUniforms(this.#position, this.#transform);

    const uni = this.#programs.grid.sharedUniforms;

    this.#gl.uniformMatrix4fv(uni.u_worldViewProjection.location, false, worldViewProjection);

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, this.#gridMesh.vertices.length / 3);
  }

  setup(programName: "basic") {
    this.#gl.useProgram(this.#programs[programName].program);
    this.setStaticUniforms();
  }

  render(mesh: LoadedMesh, position: Position, transform: Transform3D) {
    this.#gl.bindVertexArray(mesh.r_vao);

    const { worldViewProjection, transposedInvertedWorldTransforms } = this.#computeDynamicUniforms(position, transform);

    const uni = this.#programs.basic.sharedUniforms;

    this.#gl.uniformMatrix4fv(uni.u_worldViewProjection.location, false, worldViewProjection);
    this.#gl.uniformMatrix4fv(uni.u_world.location, false, transposedInvertedWorldTransforms);

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, mesh.vertices.length / 3);
  }

  #computeViewProjection() {
    const depth = 1000;

    const projection = mat4.ortho(mat4.create(), 0, this.#canvas.clientWidth, this.#canvas.clientHeight, 0, -depth, depth);

    const camera = mat4.create();
    mat4.rotateX(camera, camera, (70 * Math.PI) / 180);
    mat4.rotateY(camera, camera, (15 * Math.PI) / 180);
    mat4.rotateZ(camera, camera, (0 * Math.PI) / 180);
    mat4.translate(camera, camera, vec3.fromValues(-400, -400, 0));

    const view = mat4.invert(mat4.create(), camera)!;
    const viewProjection = mat4.multiply(mat4.create(), projection, view);

    return viewProjection;
  }

  #computeWorldTransforms(position: Position, transform: Transform3D) {
    // World
    const world = mat4.create();

    // world transforms
    mat4.translate(world, world, vec3.fromValues(position.x, position.y, position.z));
    mat4.rotateX(world, world, (transform.rotateX * Math.PI) / 180);
    mat4.rotateY(world, world, (transform.rotateY * Math.PI) / 180);
    mat4.rotateZ(world, world, (transform.rotateZ * Math.PI) / 180);
    mat4.scale(world, world, [
      transform.scaleX, transform.scaleY, transform.scaleZ,
    ]);

    return world;
  }

  #computeDynamicUniforms(position: Position, transform: Transform3D) {
    const viewProjection = this.#computeViewProjection();
    const worldTransforms = this.#computeWorldTransforms(position, transform);

    const worldViewProjection = mat4.multiply(mat4.create(), viewProjection, worldTransforms);

    const invertedWorldTransforms = mat4.invert(mat4.create(), worldTransforms);

    if (!invertedWorldTransforms) {
      throw new Error("Shouldn't happen");
    }

    const transposedInvertedWorldTransforms = mat4.transpose(mat4.create(), invertedWorldTransforms);

    return {
      worldViewProjection,
      transposedInvertedWorldTransforms,
    };
  }

  #bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    element.appendChild(canvas);

    return { canvas };
  }

  #watchResize(observer: ResizeObserver) {
    try {
      // only call us of the number of device pixels changed
      observer.observe(this.#canvas, { box: "device-pixel-content-box" });
    } catch (ex) {
      // device-pixel-content-box is not supported so fallback to this
      observer.observe(this.#canvas, { box: "content-box" });
    }
  }

  #resizeCanvasToDisplaySize() {
    // Get the size the browser is displaying the canvas in device pixels.
    const [
      displayWidth, displayHeight,
    ] = canvasToDisplaySizeMap.get(this.#canvas)!;

    // Check if the canvas is not the same size.
    const needResize = this.#canvas.width !== displayWidth || this.#canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      this.#canvas.width = displayWidth;
      this.#canvas.height = displayHeight;
    }

    return needResize;
  }
}
