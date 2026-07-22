# AreoEngine - Grid System

### World Axis

- Ground on **XZ**, height on **Y**

### Units

- **1 world unit =** 1 tile
- **1 gameplay tile =** 1 world unit
- **Grid `u_tileSize` =** `1.0`
- **Meshes:** local extent `[-0.5, 0.5]` — at transform `scale = 1` the mesh is 1 tile across
- **Floor plane:** unit mesh on **XZ** (y = 0, normal +Y); `scaleX` / `scaleZ` = tiles across (e.g. 40). No rotation needed.

See `guides/labs/world-scale-lab.html` for the interactive walkthrough.
