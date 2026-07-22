# Floor Grid — Implementation Guide

A visual floor grid for the 3D view: dark background, light gray lines, spacing that can change with zoom.

You already have a mesh catalog, a `basic` shader program, and a draw loop that renders entities. This guide adds a **separate** floor pass. Gameplay tile data is out of scope — this is only the guide lines you see.

---

## Goal

1. One large ground plane (a quad).
2. Lines drawn in a **fragment shader** from world-space coordinates (not thousands of line meshes).
3. Optional later: change line spacing when the camera zooms.

When you’re done, the frame should look roughly like:

```
clear
→ draw floor (grid program)
→ draw entities (basic program)
```

---



## Learning path (do this before / alongside coding)

1. **[world-scale-lab.html](labs/world-scale-lab.html)** — start here if sizes feel random. Pick what 1 unit means; align floor / tiles / camera.
2. **[grid-shader-basics.html](labs/grid-shader-basics.html)** — world position → `fract` → lines → a first grid. Open in a browser.
3. **This guide** — mesh, second program, draw order in *your* engine.
4. **[pristine-grid-lab.html](labs/pristine-grid-lab.html)** — later / optional. Golus-style AA. Skip until a jaggy grid already works.

### Concepts you’ll meet

- **Vertex shader vs fragment shader** — what runs per vertex vs per pixel
- **Uniforms** — values you set from JS/TS each frame (color, tile size, matrices)
- **Varyings /** `out` **→** `in` — how the vertex shader passes data to the fragment shader
- **World space vs clip space** — why grid math should use world XZ (not `gl_Position`)
- `fract` — how repeating patterns work in shaders
- `fwidth` **/** `smoothstep` — optional polish after a hard-edged grid works

Your ground plane is **XZ**, height **Y** (see `docs/grid-system.md`).

---



## Step 0 — Decide the ground plane

Your entities currently use `x`, `y`, with `z ≈ 0`. Pick one and stick to it for the floor:

- Ground on **XY**, height on **Z**, or
- Ground on **XZ**, height on **Y** (common in 3D)

Write it down. Every position and shader sample for the grid must use the same two axes.

---



## Step 1 — A floor mesh

Create a simple quad mesh (two triangles) large enough to fill the view.

Hints:

- Put it in the mesh catalog like your other meshes (`r_id`, `vertices`, …).
- Normals can be constant (pointing “up” along your height axis) even if the grid shader ignores lighting.
- Start huge (e.g. thousands of units). You can resize later.
- Center it or sit it at the origin — your choice, but know where `(0,0)` is on the plane.

Checkpoint: you could draw this quad with the **existing** `basic` shader as a flat colored plane. If that works, geometry and upload path are fine.

---



## Step 2 — A second shader program

Add a `grid` (name up to you) program next to `basic`. Do not bolt grid logic into the lit cube shader.

### Vertex shader — your jobs

- Transform position with the same world / view / projection idea you already use for entities.
- Pass **world-space** position of the vertex to the fragment shader (a `vec3` or `vec2` varying).

Think: “fragment shader needs to know *where on the floor* this pixel is.”

### Fragment shader — your jobs

- Take that world position.
- Decide “am I on a grid line?” using something like spacing + `fract`.
- Mix a dark background color and a light gray line color.
- Output that color (usually unlit — no N·L).

Start with **fixed** `u_tileSize` and hard-coded colors. Zoom comes later.

Checkpoint: one gray grid over a dark floor. Lines may look jaggy; that’s OK for now.

---



## Step 3 — Wire it into the renderer

Rough flow (pseudo):

```
init:
  create grid program
  upload floor mesh VAO for that program (attributes must match the grid shaders)

each frame:
  clear (dark clear color is fine)
  use grid program
  set matrices + u_tileSize + colors
  draw floor mesh once
  use basic program
  draw entities as today
```

Things you’ll bump into (good learning):

- Grid program attributes/uniforms are not the same as `basic` — discover them the same way you already do for programs.
- Floor is not an “entity in the world storage.” It’s renderer (or scene) infrastructure. Keep it out of the per-entity loop.
- Draw order: floor first, then objects, with depth test on so things sit on the plane.

Checkpoint: entities appear on top of the grid.

---



## Step 4 — Make the lines look decent

Improve the fragment shader without changing the mesh:

1. Use screen-aware thickness (`fwidth` is the usual tool) so lines don’t shimmer when tilted.
2. Tune colors (dark bg, soft gray lines).
3. Optional: every Nth line brighter (major / minor grid).

If lines disappear or fill the whole screen, your spacing math or axes are wrong — print/debug world coords (e.g. color by `fract(world / tileSize)`).

---



## Step 5 — Zoom-aware spacing (optional second milestone)

Only after a fixed grid looks good.

1. Decide what “zoom” means in your camera (ortho size, scale factor, etc.).
2. Each frame, set a uniform from that value.
3. First attempt: `tileSize = base * f(zoom)` — coarse but educational.
4. Better attempt: fade between two spacings (e.g. powers of 10) so it doesn’t pop.

Keep **gameplay** cell size separate in your head: visual guide can coarsen when zoomed out; placement logic can still use a fixed cell size.

---



## Step 6 — Align with future gameplay (when you’re ready)

Not required for the visual:

- Same `tileSize` (when zoomed in) as logical cell size → lines match build grid.
- Helpers later: `world → (col, row)` for mouse picking.

Don’t store the visual grid as one ECS entity per cell.

---



## Suggested file / responsibility split

Vague on purpose — place things where *your* project already puts similar code:


| Piece                       | Belongs with                 |
| --------------------------- | ---------------------------- |
| GLSL source                 | shaders                      |
| Floor mesh data             | shapes / mesh catalog        |
| Program create + draw floor | renderer                     |
| Zoom → tileSize             | camera / renderer uniforms   |
| Logical map cells           | game world (later, separate) |


---



## Order of work (checklist)

- [ ] Ground axes chosen
- [ ] Floor quad in catalog, drawable with `basic`
- [ ] `grid` vertex + fragment shaders compiling/linking
- [ ] Floor drawn once per frame before entities
- [ ] Procedural lines from world position
- [ ] Anti-aliased / major-minor polish
- [ ] (Optional) spacing from zoom

---



## When you’re stuck

Ask in this order:

1. Is the quad visible at all (solid color)?
2. Are world coords reaching the fragment shader (color by `world.x`, `world.y`)?
3. Does `fract(world / tileSize)` look like a repeating pattern?
4. Only then: line mask + mix colors.

If (1) fails, it’s upload/matrices/draw call. If (2)–(3) fail, it’s varyings/axes. If (4) fails, it’s the line formula.

---



## Out of scope (on purpose)

- Instanced tiles / chunk meshes for terrain
- Pathfinding or occupancy
- Textures for the grid
- Entity-per-cell floor

Ship a pretty guide plane first. Everything else builds on top.