/**
 * A mutable 2D vector
 */
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2) {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  static add(a: Vector2, b: Vector2, target: Vector2) {
    target.x = a.x + b.x;
    target.y = a.y + b.y;
  }
}
