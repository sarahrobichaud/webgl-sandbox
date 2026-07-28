# Engine & Game Architecture — High-Level Course

A short path for thinking about **where concepts live** when the product is a web-based airport / grid management empire — without tying to any particular codebase.

**Flavor context (the product in your head):**

- Players have accounts and playthroughs (ignore real auth; treat external data as contracts).
- A playthrough is an **empire**: world map, multiple businesses (airports).
- Only the **focused** business runs a full grid simulation.
- Background businesses stay simplified but can still take deals / contracts.
- The long-term engine goal: specialized for **grid-based management** games.

**Not in this course:** WebGL, ECS stores, input device details, your current folder layout.

---

## Learning path

Do these in order. Each is a self-contained HTML lab — open in a browser.

1. **[Engine vs Game Lab](labs/engine-vs-game-lab.html)** — what belongs in a reusable engine vs in *this* product’s game logic. One litmus test you can reuse forever.
2. **[Focus & Fidelity Lab](labs/focus-fidelity-lab.html)** — empire map vs site view; full sim vs abstract background; what “zoom out” really means architecturally.
3. **[Frame Bridge Lab](labs/frame-bridge-lab.html)** — how one frame connects host → game intent → simulation → presentation, without smearing layers together.

Optional nearby lab (different angle — runtime machinery vs domain truth, and it *does* reference older stub names):

- [Runtime vs Domain Lab](labs/runtime-vs-domain-lab.html)

---

## The mental model you’ll leave with

```text
┌─────────────────────────────────────────────┐
│  PRODUCT / APP SHELL                        │
│  account contracts · load playthrough · UI  │
└─────────────────────┬───────────────────────┘
                      │ mounts
┌─────────────────────▼───────────────────────┐
│  GAME (meaning)                             │
│  empire · businesses · money · contracts    │
│  focus · which site is “the” full world     │
└─────────────────────┬───────────────────────┘
                      │ uses
┌─────────────────────▼───────────────────────┐
│  ENGINE (mechanisms)                        │
│  loop · input · scenes · render             │
│  grid world + step hooks (site sim tools)   │
└─────────────────────────────────────────────┘
```

**Rule of thumb:** if another grid management game (harbor, warehouse park) would reuse the type unchanged → engine. If it only makes sense because this is an airport empire → game.

---

## After the labs

You should be able to answer, for any new idea:

1. Engine, game, or app shell?
2. Does it need a full grid world, or only an abstract business state?
3. Does the frame loop *own* it, or only *drive* / *display* it?
