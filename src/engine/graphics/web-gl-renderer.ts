import { mat4, vec3 } from "gl-matrix";
import type { Renderer2D as Renderer3D, Viewport } from "./types";
import { CUBE_VERTICES, RECT_VERTICES } from "./shapes/vertices";
function randomColor() {
  return [
    Math.random(), Math.random(), Math.random(),
  ];
}

function getColorData(vertices: number[]) {
  const len = vertices.length / 3;

  const colors = [];
  for (let i = 0; i < len; i++) {
    colors.push(...randomColor());
  }

  return colors;
}
// ];

// const colorData = [
//   1, 0, 1,
//   1, 0, 1,
//   0, 0, 1,
//   1, 1, 1,
// ];

export class WebGlRenderer implements Renderer3D {
  #viewport: Viewport = { size: { height: 0, width: 0 } };
  #context: WebGL2RenderingContext;
  #canvas: HTMLCanvasElement;

  #rectColor = getColorData(RECT_VERTICES);
  #cubeColor = getColorData(CUBE_VERTICES);

  constructor(parentElement: HTMLElement) {
    const { canvas } = this.bootstrap(parentElement);

    const gl = canvas.getContext("webgl2")!;

    this.#context = gl;

    this.#canvas = canvas;

    this.handleResize();
  }

  get viewport() {
    return this.#viewport;
  }

  clear() {}

  rectangle3D() {
    const gl = this.#context;

    const vertices = CUBE_VERTICES;
    const colorData = this.#cubeColor;

    const buffers = {
      position: gl.createBuffer(),
      color: gl.createBuffer(),
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vShader = gl.createShader(gl.VERTEX_SHADER)!;
    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(
      vShader,
      `
        attribute vec3 position;
        attribute vec3 color;
        varying vec3 vColor;

        uniform mat4 matrix;

        void main() {
          vColor = color;
          gl_Position = matrix * vec4(position, 1);
        }
      `,
    );

    gl.compileShader(vShader);

    gl.shaderSource(
      fShader,
      `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1);
        }
      `,
    );

    gl.compileShader(fShader);

    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    const attributeLocations = {
      color: gl.getAttribLocation(program, "color"),
      position: gl.getAttribLocation(program, "position"),
    };

    gl.enableVertexAttribArray(attributeLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(attributeLocations.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(attributeLocations.color, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const matrix = mat4.create();

    mat4.scale(
      matrix,
      matrix,
      [
        0.25, 0.25, 0.25,
      ],
    );

    const uniformLocations = {
      matrix: gl.getUniformLocation(program, "matrix"),
    };

    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
  }

  rectangle(x: number, y: number, width: number, height: number, color: string): void {
    console.log("das");
    // Create buffer

    const gl = this.#context;

    const vertices = RECT_VERTICES;
    const colorData = this.#rectColor;

    // prettier-ignore
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vShader = gl.createShader(gl.VERTEX_SHADER)!;

    gl.shaderSource(
      vShader,
      `
      precision mediump float;

      attribute vec3 position;
      attribute vec3 color;

      varying vec3 vColor;

      uniform mat4 matrix;

      void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
      }
    `,
    );

    gl.compileShader(vShader);
    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(
      fShader,
      `
      precision mediump float;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1);
      }
      `,
    );

    gl.compileShader(fShader);

    const program = gl.createProgram();

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    const attributeLocations = {
      color: gl.getAttribLocation(program, "color"),
      position: gl.getAttribLocation(program, "position"),
    };
    gl.enableVertexAttribArray(attributeLocations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(attributeLocations.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(attributeLocations.color, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const uniformLocations = {
      matrix: gl.getUniformLocation(program, "matrix"),
    };

    const matrix = mat4.create();

    mat4.scale(
      matrix,
      matrix,
      [
        0.2, 0.2, 0.2,
      ],
    );

    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
  }

  private bootstrap(element: HTMLElement) {
    const canvas = document.createElement("canvas");

    canvas.id = "game-view";

    this.setCanvasSize(canvas);
    element.appendChild(canvas);

    return { canvas };
  }

  private handleResize() {
    window.addEventListener("resize", this.setCanvasSize.bind(this, this.#canvas));
  }

  private setCanvasSize(canvas: HTMLCanvasElement) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    this.#viewport.size.height = window.innerHeight;
    this.#viewport.size.width = window.innerWidth;
  }
}
