import { canvasToDisplaySizeMap, measureElement } from "../canvas/canvas-utils";
import { shaders } from "./shaders/basic-shader";
import { mat4, vec3 } from "gl-matrix";
import { AreoGL } from "./webgl-lib/areo-gl";
import { gridShaders } from "./shaders/grid-shader";
import { MESHES } from "../geometry/mesh";
import type { Position, SpacialData } from "../../../contracts/spatial/spatial.contract";
import type { RendererBackend } from "../../../contracts/internal";
import type { LoadedMesh, Program, Viewport } from "../../../contracts/rendering/renderer.contract";
import type { Mesh } from "../../../contracts/geometry/geometry.contract";

export class WebGlRenderer implements RendererBackend {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #gl: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #programs: Record<string, Program> = {};
  #aero: AreoGL;

  #gridMesh = MESHES.plane;

  constructor(parentElement: HTMLCanvasElement) {
    this.#gl = parentElement.getContext("webgl2")!;
    this.#canvas = parentElement;
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
    // Each program needs its own VAO — attribute locations can differ.
    this.#aero.loadGeometry(this.#programs.basic, meshes);
    this.#aero.loadGeometry(this.#programs.grid, [
      this.#gridMesh,
    ]);
  }

  setStaticUniforms() {
    const uni = this.#programs.basic.sharedUniforms;

    // Optional while debugging (e.g. normal-as-color shader may not declare these).
    if (uni.u_color) {
      this.#gl.uniform4fv(
        uni.u_color.location,
        [
          1, 1, 1,
          1,
        ],
      );
    }
    if (uni.u_reverseLightDirection) {
      this.#gl.uniform3fv(uni.u_reverseLightDirection.location, vec3.normalize(vec3.create(), vec3.fromValues(8, 8, 4)));
    }
  }

  // Floor: unit XZ plane; scaleX/scaleZ = tiles across (see grid-system.md)
  #position = { x: 2, y: 2, z: 2 };
  #transform = {
    scale: {
      x: 100,
      y: 100,
      z: 100,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  };

  renderGrid(viewProjection: mat4) {
    this.#gl.useProgram(this.#programs.grid.program);

    if (!this.#gridMesh.r_vao) {
      throw new Error("Grid Mesh not loaded");
    }

    this.#gl.bindVertexArray(this.#gridMesh.r_vao);

    // Grid needs the real world matrix for v_worldPos — not the normal matrix
    // (transpose(inverse(world))) that basic uses for lighting.
    const { worldViewProjection, world } = this.#computeDynamicUniforms(viewProjection, this.#position, this.#transform);

    const uni = this.#programs.grid.sharedUniforms;

    this.#gl.uniformMatrix4fv(uni.u_worldViewProjection.location, false, worldViewProjection);
    this.#gl.uniformMatrix4fv(uni.u_world.location, false, world);

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, this.#gridMesh.vertices.length / 3);
  }

  setup(programName: "basic") {
    this.#gl.useProgram(this.#programs[programName].program);
    this.setStaticUniforms();
  }

  render(viewProjection: mat4, mesh: LoadedMesh, position: Position, transform: SpacialData) {
    this.#gl.bindVertexArray(mesh.r_vao);

    const { worldViewProjection, transposedInvertedWorldTransforms } = this.#computeDynamicUniforms(viewProjection, position, transform, mesh.origin);

    const uni = this.#programs.basic.sharedUniforms;

    this.#gl.uniformMatrix4fv(uni.u_worldViewProjection.location, false, worldViewProjection);
    this.#gl.uniformMatrix4fv(uni.u_world.location, false, transposedInvertedWorldTransforms);

    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, mesh.vertices.length / 3);
  }

  #computeWorldTransforms(
    position: Position,
    transform: SpacialData,
    origin?: [
      number, number, number,
    ],
  ) {
    // World
    const world = mat4.create();

    // world transforms
    mat4.translate(world, world, vec3.fromValues(position.x, position.y, position.z));

    mat4.rotateX(world, world, (transform.rotation.x * Math.PI) / 180);
    mat4.rotateY(world, world, (transform.rotation.y * Math.PI) / 180);
    mat4.rotateZ(world, world, (transform.rotation.z * Math.PI) / 180);
    mat4.scale(world, world, [
      transform.scale.x, transform.scale.y, transform.scale.z,
    ]);

    if (origin) {
      mat4.translate(world, world, vec3.fromValues(-origin[0], -origin[1], -origin[2]));
    }
    return world;
  }

  #computeDynamicUniforms(
    viewProjection: mat4,
    position: Position,
    transform: SpacialData,
    origin?: [
      number, number, number,
    ],
  ) {
    // Flip to "perspective" when debugging orientations; keep "ortho" for tile work.
    const worldTransforms = this.#computeWorldTransforms(position, transform, origin);

    const worldViewProjection = mat4.multiply(mat4.create(), viewProjection, worldTransforms);

    const invertedWorldTransforms = mat4.invert(mat4.create(), worldTransforms);

    if (!invertedWorldTransforms) {
      throw new Error("Shouldn't happen");
    }

    const transposedInvertedWorldTransforms = mat4.transpose(mat4.create(), invertedWorldTransforms);

    return {
      world: worldTransforms,
      worldViewProjection,
      transposedInvertedWorldTransforms,
    };
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
