# ProcessChamp

Rebuild of [processchamp.com](https://processchamp.com) — a React + Vite site whose home page is a
single continuous 3D factory floor you scroll through, in place of the previous WordPress/Avada
theme. Every piece of copy, every video and every product from the old site is carried over;
nothing was dropped.

## Look and feel

Light, not dark. A paper ramp (`--color-paper-*`) under near-black ink, with
blue as the only accent: `--color-blue-600 #0d5fc4` for buttons, links and
machine livery, green `#0f8a4d` for in-tolerance, `#c3362f` for a measured
deviation before it is driven out. Tokens live in `src/index.css`.

Type is **Archivo** (utilitarian grotesque, tight tracking) with **IBM Plex
Mono** for every technical label, data key and station tag — the `label` and
`label-mute` utilities. Deliberately not Inter.

Surfaces are flat: 1px rules, square-ish 3px corners, a printed `blueprint`
grid. The one exception is the `glass` utility — real frosted glass, tuned for
a bright scene — used for the station cards that sit over the 3D floor, so it
stays special rather than being the default for every box.

The shipped benefit PNGs were orange, so they were redrawn as vector icons in
`BenefitIcon.jsx`; the files are still in `public/assets`.

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Build | Vite 5 | Fast dev, static output, no server needed |
| UI | React 18 + React Router 6 | Client routing for five pages |
| Styling | Tailwind CSS 4 (`@theme` tokens) | Palette lives in `src/index.css` |
| 3D | three.js + @react-three/fiber + drei | Procedural geometry only — no model downloads |
| Motion | framer-motion | Scroll reveals, nav transitions, reduced-motion aware |

## Running it

```bash
npm install
npm run dev      # http://localhost:5181
npm run build    # -> dist/
npm run preview  # serve the build
```

## Structure

```
public/assets/     brand assets pulled from the live site (logo, icons, hero footage, booth photo)
src/data/site.js   ALL page copy, nav, product list, video ids — single source of truth
src/three/         the 3D layer
  RobotArm.jsx     procedural 6-axis arm; `program` picks the motion cycle,
                   `tool` the end effector (gripper / weld gun / vacuum / scanner)
  Bits.jsx         scan cloud, laser sweep, datum pins, panel, drift
  Stage.jsx        Canvas wrapper + lighting rig + lightformer environment (GeoSet page)
  FixtureScene.jsx rigid-jig vs fixtureless toggle on the GeoSet AI page
  FactoryCanvas.jsx  the persistent floor: camera rig, traveling lights, perf degrade
  factory/layout.js  station positions and the two camera splines
  factory/progress.js  scroll progress, kept out of React state
  factory/World.jsx  slab, striping, columns, trusses, conveyor, backdrop, blob shadows
  factory/Parts.jsx  mobile skid, cabinet, vision head, gantry, slotted tote, AGV,
                     weld, deviation arrow, andon stack light, HMI kiosk,
                     structured-light grid, holographic twin, pick candidate,
                     tolerance gauge, tool rack, stamped part, canvas-texture readout
  factory/Car.jsx    the body in white: pressed body sides, full underbody and
                     front/rear structure, crowned roof, skid, door closure
  factory/Stations.jsx  the seven stations
  showcase/Specimens.jsx  the five application-area specimens
  showcase/Bay.jsx   a slice of the same plant, so specimens stand on the floor
  ShowcaseCanvas.jsx  specimen viewport: dollies between specimens and projects
                      the anchor point to screen space each frame
src/components/    Journey (the scroll overlay), nav, footer, video facade, reveal,
                   marquee, CTA, logo, glyphs
src/pages/         Home, About, Products, GeoSetAI, Contact, NotFound
```

### The factory walk

The home page **is** the walk. There are no sections after it — every part of the old site is a
station on one 290-unit aisle rendered into a single fixed canvas: the hero, the three process
steps, the benefits, the application-area films, the product portfolio, the Automate 24 stand, and
the contact call to action, which is an operator at a front desk at the end of the line.

`Journey` measures its own scroll track and writes a 0–1 value that `CameraRig` reads every frame.
Position and look-at are **two separate splines**, so the camera leads into a station rather than
cutting to it. The DOM and the flight share an index: each station is exactly one `h-screen`
section, so section *i* is centred when track progress is `i / 11`, which is also the curve
parameter for waypoint *i*. Caption cards alternate sides and each station's subject sits on the
opposite side of the aisle, so the two never fight for the same pixels.

Scroll does not map to the curve linearly. `dwell()` parks the camera at a station for the middle
~30% of each section and only travels at the edges, so the picture is still while you read and
moves when you keep scrolling.

### Before and after

The body shop (stations 00–06) has two dressings, switched by a toggle that
only appears in those bays. Same camera, same angle, same body — what changes
is the floor around it:

| | Conventional | With ProcessChamp |
| --- | --- | --- |
| Holding the part | bolted steel jig, pneumatic clamps, one per variant | robots hold it in free space |
| Moving it | manual overhead hoist | the cell does it |
| Checking it | gauge on a granite table, off the line | inline vision, in cycle |
| Correcting it | rework bay, reject tag, scrap bin | deviation driven out before the joint |
| Solving it | paper travellers on a desk, days later | control room, 38 ms |
| The result | queued bodies, red beacons, painted hold zones | the line keeps moving |

Nothing explains the difference in prose — the bay is simply re-dressed and
the caption card collapses to its station label so it does not sit on top of
the thing you are meant to look at. A bottleneck is drawn as what it actually
looks like from the aisle: work piled up behind a station that is stopped.

The conventional lighting is duller and warmer, and the andon towers run red.

### Keeping it one line

Twelve dressed bays with their own four walls read as twelve separate rooms, so the things that
run the *whole* length are always in the scene regardless of which bay is mounted:

- a skid **transfer line** down the centre of the aisle — rails, sleepers and bodies riding it
  between the stations as well as in them
- one continuous **back wall** for the hall, panelled and accent-banded per bay rather than
  rebuilt per bay
- identical **sign gantries** at a fixed pitch over every bay entrance, so you can read the next
  few bay numbers down the aisle from wherever you are standing
- an overhead **monorail**, cable tray and compressed-air main
- painted **direction arrows** down the transfer lane

Only the cells that would really be enclosed keep walls: the scan booth, the weld cell and the
demo bay. Everything else opens onto the shared hall.

### Making the bays distinct

Each station has its own enclosure, paint, floor marking and light colour, defined in
`STATION_STYLE`: an amber racking area for intake, a dark shrouded booth for scanning, a glazed
control room for the solver, a weld cell hung with amber curtains, a white metrology bay, a green
release gate, and so on. The travelling lights blend toward the bay the camera is standing in.

### Performance

Twelve dressed bays in the scene at once costs about a second a frame, so `Stations` mounts only
the bays within one station of the camera. The mirror floor went too — it re-renders the whole
aisle every frame, and the concrete texture carries the realism instead.

### Textures

`textures.js` generates everything procedurally on a canvas — no image downloads. Sealed concrete
with aggregate, trowel swirls and saw-cut joints; per-bay painted floor markings with the station
number; hazard striping for thresholds; brushed grain for machine shells; galvanised spangle;
painted sheet with grime at the base; and guard mesh.

What the aisle builds is a car. Stations, in order: the floor → body sides located in the rack →
underbody datums scanned → the solver and its digital twin → a body side set onto the underbody and
welded → **inline vision correction** → the finished body in white released. The body is further
along at each station, so the aisle itself reads as a sequence.

The correction station is a closure fit: a door hung in the aperture arrives low, outboard and
cocked, overhead cameras read gap and flush, deviation arrows shrink as the robot drives the error
out, a red wireframe ghost of the as-found pose fades behind it, and the tolerance gauge swings to
green — all on an 8-second loop.

## The body in white

Body sides are extruded from a real silhouette — rocker, both wheel arches,
A/B/C pillars, roof rail — with the door apertures cut as holes. The extrusion
is then **pressed**: `pressPanel` walks the vertices and adds crown along the
length and tumblehome up the height. Without that the panel reads as cardboard
no matter how good the outline is.

Around it sits the structure that makes it legible as a car rather than a box:
rockers and B-pillar reinforcements, roof-rail weld flanges, a crowned roof
with bows and windshield/backlight headers, wheel houses, floorpan with tunnel
and four cross members, front rails with shock towers and a radiator support,
rear rails, parcel shelf and rear panel.

## Application areas

`ApplicationShowcase` is the old video grid rebuilt as a drafting blow-out, and
it runs in the same plant: `Bay` renders a slice of the floor — slab, painted
cell footprint, aisle striping, columns, roof glazing — so each specimen is
presented on a stand under the same light as the journey, not floating on a
background. Each of the five
application areas has a 3D specimen — an airframe section, a tailgate decking into its opening, a
weld seam, a part insertion, a bin pick. A leader line runs from the feature being worked out to a
callout, and opening the callout zooms the model toward that point while the real footage pops out
of it. The leader line is written straight to the DOM from the render loop; React state there would
re-render the section sixty times a second for a two-point polyline.

All geometry is generated in code — there are no `.glb`/`.hdr` files to fetch, so the scene cannot
fail on a missing asset. Polished metal needs something to reflect, so `StudioEnv` builds an
environment map from drei `Lightformer`s at runtime instead of downloading an HDRI. Real shadow maps
cannot cover a 180-unit aisle at useful resolution, so machines get soft blob decals instead and the
lights travel with the camera.

In-scene readouts are drawn to canvas textures rather than DOM overlays. drei's `<Html>` was the
first attempt: it ignores depth and fog, and panels behind the camera scaled up and blacked out the
viewport.

Guards for weak hardware:

- Under 900px wide, four cores or fewer, or reduced-motion: no floor reflections, no camera drift,
  lower DPR, no antialiasing.
- `PerformanceMonitor` degrades further if frame rate declines.
- Rendering stops entirely (`frameloop="never"`) once the journey scrolls out of view.
- No WebGL falls back to the original `.webm` cell footage.
- Vertical fov widens on narrow viewports, and the camera aims lower so the machine sits above the
  caption card instead of behind it.

### Videos

Video cards are click-to-load facades. No YouTube or Vimeo script runs until a visitor presses play,
which keeps the page fast and the third-party tracking surface small.

### Contact form

With `VITE_FORM_ENDPOINT` set (Formspree, Basin, your own handler) the form POSTs JSON there. With
it unset, the form composes an email to `admin@processchamp.com` — so the button never silently does
nothing. Copy `.env.example` to `.env` to configure it.

## Deploying

`npm run build` emits a static `dist/`. Both host configs are already in the repo:

- **Netlify** — `public/_redirects` handles SPA fallback plus 301s from the old
  `/about-us/` and `/contact-us/` WordPress paths.
- **Vercel** — `vercel.json` does the same.

On any other host, rewrite unknown paths to `/index.html` and keep those two legacy redirects.

## Content parity with the old site

- Hero headline, subhead, five benefit icons and their captions
- "How it works" steps 01–03, verbatim — now the captions for stations 02, 03 and 04
- All five YouTube demos and the Vimeo overview
- The Automate24 / Toyota note and its four benefit points
- About Us company copy in full
- GeoSet AI page copy in full
- Contact details: `admin@processchamp.com`, `614-778-7035`
- Nav structure including GeoFit AI, GeoInspect AI, GeoPredict AI and Engineering Services, which
  previously existed only as menu items with descriptions and now have real sections on `/products`
