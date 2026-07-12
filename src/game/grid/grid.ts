import { World } from "../world";

export interface Tile {
  color: string;
}

export interface Grid {
  size: number;
  gap: number;
  tiles: Tile;
}

export function createGrid(world: World, w: number, h: number) {
  const tileSize = 50;
  const tileGap = 3;
  const gridId = world.createEntity();

  world.positions.set(gridId, { x: 0, y: 0 });

  const tiles: Tile[][] = [];

  let x;
  let y;

  for (let i = 0; i < w; i++) {
    tiles[i] = [];
    y = i * (tileSize + tileGap);
    for (let j = 0; j < h; j++) {
      x = j * (tileSize + tileGap);
      tiles[i].push({ color: "#fff", x, y });
    }
  }

  world.grids.set(gridId, tiles);

  console.log(world.grids.get(gridId));

  return gridId;
}
