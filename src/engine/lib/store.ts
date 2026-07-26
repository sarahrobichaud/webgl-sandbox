import type { EntityId } from "../contracts/branded-values";
import type { ComponentStorage } from "../contracts/data/store.contract";

export class Store<T> implements ComponentStorage<T> {
  #sparse = new Map<EntityId, number>();
  #dense: T[] = [];
  #entities: EntityId[] = [];

  get size() {
    return this.#dense.length;
  }

  has(id: EntityId): boolean {
    return this.#sparse.has(id);
  }

  get(id: EntityId): T | undefined {
    const idx = this.#sparse.get(id);

    if (idx === undefined) {
      return undefined;
    }

    return this.#dense[idx];
  }

  set(id: EntityId, value: T): void {
    const existing = this.#sparse.get(id);
    if (existing !== undefined) {
      this.#dense[existing] = value;
      return;
    }
    const index = this.#dense.length;
    this.#dense.push(value);
    this.#entities.push(id);
    this.#sparse.set(id, index);
  }

  remove(id: EntityId): void {
    const index = this.#sparse.get(id);
    if (index === undefined) return;

    const last = this.#dense.length - 1;
    if (index !== last) {
      const lastId = this.#entities[last];
      this.#dense[index] = this.#dense[last];
      this.#entities[index] = lastId;
      this.#sparse.set(lastId, index);
    }
    this.#dense.pop();
    this.#entities.pop();
    this.#sparse.delete(id);
  }

  *entries(): IterableIterator<
    [
      EntityId, T,
    ]
  > {
    for (let i = 0; i < this.#dense.length; i++) {
      yield [
        this.#entities[i], this.#dense[i],
      ];
    }
  }
}
