# BULWARK: THE ASHEN MARCH

A complete, buildless 2D tower defense game in plain HTML, CSS, and ES-module JavaScript. Eight handcrafted road layouts cross three regions, with bosses at missions 3, 6, and 8. Kenney's Tiny Dungeon and Tiny Town CC0 assets are included locally.

## Play locally

From the project directory:

```sh
python3 -m http.server 4173 --directory dist
```

Visit `http://localhost:4173`. Alternatively, `npm start` runs the same server. There is no dependency installation or build step. ES modules require an HTTP server; do not open the HTML using `file://`.

## GitHub Pages — deploy as-is

1. In your GitHub repository, choose **Add file → Upload files**. Open this Bulwark folder in Finder, select its contents, and drag them into the upload area. Choose **Commit changes**. Keep `index.html`, `dist/`, and `README.md` at the repository root.
2. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**.
3. Select your branch (usually `main`) and **/ (root)**, then save.
4. Open the Pages URL when deployment completes. The root entrypoint forwards to `./dist/`; every game asset and module uses a relative path, so repository subpaths work.

You can instead publish the contents of `dist/` directly as the root of any static host. No server API, environment variables, service, npm package, or bundler is required. Google Fonts are optional cosmetic enhancements; readable system fallbacks work when offline. This upload copy omits unused art-pack extras and private-preview metadata. All game code, required images, licenses, and tests are included.

## Controls

| Input | Action |
| --- | --- |
| Click a tower card, then a `+` plot | Build a defense |
| Click an empty plot, then a tower card | Build a defense |
| Click a built tower | Inspect, upgrade, branch, sell, or set rally |
| Click open ground | Move your hero |
| Q | Hero area attack |
| W | Buff nearby towers and soldiers with a banner |
| 1–4 | Select Barracks / Archer / Cauldron / Sanctum |
| N | Call a wave, earning early-call gold during the break |
| Space | Pause / resume |
| Escape | Cancel targeting or selection |
| Speed button | Cycle 1×, 2×, 3× |

Meteor and militia supplies need a battlefield target. Militia targets snap to the road. Barracks and Soulforge rally points must stay within the tower's range. Upgrading Barracks or Soulforge instantly replaces its squad at full health. Selling returns 70% of the total investment, rounded down.

## Content and modules

```text
dist/
  index.html, style.css
  assets/tiny-dungeon/      Runtime assets and original license
  assets/tiny-town/         Runtime assets and original license
  js/
    main.js                Canvas loop, input, optional WebMCP controls
    game.js                Battle state, lifecycle, outcomes
    render.js              Kenney atlas lookup, tint cache, terrain, effects
    towers.js              Building, upgrades, branches, squads, targeting
    enemies.js             Damage, resistances, blocking, enemy abilities
    waves.js               Spawning, intermissions, early-call economy
    hero.js                Four heroes, movement, abilities, persistent XP
    levels.js              Path geometry and nearest-road projection
    shop.js                Gem consumables and targeting
    save.js                Versioned localStorage, migration, export/import
    ui.js                  HUD, campaign, council, guide, settings
    audio.js               Synthesized effects and ambient wind
    data/
      towers.js            Exact requested base stat curves and branches
      enemies.js           Base roster, gimmicks, three region bosses
      levels.js            Eight authored paths, plots, regions, starting gold
      waves.js             Opening waves and expandable campaign templates
```

To expand content, add definitions in `js/data/`. `wavesFor` substitutes the mission's introduced enemy into the campaign wave templates; minibosses remain singleton groups and heavy elites are capped at two per group. Base enemy statistics are not changed per mission. Difficulty changes health by 0.8 / 1.0 / 1.2; Iron uses Hard health, one gate life, and only Archer / Sanctum towers.

## Balance and progression

The first mission has seven waves, beginning with three Husks and ending with twelve Husks plus four Blightclad. Later missions have ten waves, or eleven with a boss. Enemies spawn 0.6–1.5 seconds apart, with a 20-second preparation break after a cleared wave. Clearing a wave awards `25 + wave × 5 + missionIndex × 4` gold. Calling early awards `ceil(secondsRemaining × 0.8)` gold and reduces hero cooldowns by 0.3 seconds per bonus gold.

The provided L1–L3 tower curves take precedence over a universal cost/DPS ratio: the specified artillery and magic curves themselves cannot all meet an 11–17 single-target ratio. Artillery, Volley, blockers, resistance counters, and specializations gain value from multiple targets, control, or armor bypass. No supplied base costs or damage curves were changed to force that ratio.

Three stars require at least 18 lives, two require at least 10, and one requires surviving. Each newly earned star grants five gems; replaying an unchanged score does not farm gems. You start with 15 gems. War Council ranks cost 1, 2, 3, 4, then 5 stars and take effect next mission. Hero experience is shared across the roster and increases every 60 kills; a hero's battle stats update on the next mission. Unlock Mora after mission 3, Silas after mission 6, Bonnie after mission 7, and Iron after winning mission 8.

## Saving

Progress is autosaved every ten simulated seconds, after progression changes, and on page exit. The version-2 schema stores stars, gems, campaign unlocks, shared hero experience, selected hero, meta-upgrades, sound, and difficulty. Version-1 saves migrate through `migrate()`. Invalid input is rejected or safely falls back to a fresh save.

Use **Settings → Export save → Copy** for a portable base64-encoded JSON backup. Paste it into the same field and choose **Import save** to restore. Import replaces the current campaign and restarts the first mission. Active battlefield state is intentionally not saved: reopening starts a fresh battle while retaining all campaign progression. Browser profiles and different origins have separate saves; export/import bridges the local, Pages, and private-preview versions.

## Verification

```sh
npm test
```

Twelve Node tests cover data references and exact curves, blocking, air/tunnel behavior, armor and resistance, upgrades and squad restoration, refunds, consumables, abilities, versioned save roundtrips, early waves, Iron restrictions, pause, a full opening-level simulation, and all eight Normal missions with attainable campaign upgrades and branching. Normal campaign simulations complete without gems. Later missions are harder and have not undergone exhaustive human tuning across all four difficulties.

Browser checks verified real plot placement and gold deduction, UI rendering, structured control success/failure paths, and an exact save export match after physically closing and reopening the tab. No runtime console errors appeared in that check.

## Art and audio credits

- [Tiny Dungeon — Kenney](https://kenney.nl/assets/tiny-dungeon), downloaded and inspected from the official source.
- [Tiny Town — Kenney](https://kenney.nl/assets/tiny-town), downloaded and inspected from the official source.
- Both packs are **CC0**; original licenses are preserved in their directories. `render.js` samples the inspected 12-column, 16×16 atlas with 1px gutters. Sprites are recolored through cached canvas compositing. Terrain, roads, range circles, tower assembly, torches, fog, banners, projectiles, and particles are procedural.
- Sound effects and wind are synthesized using Web Audio; no audio files or sound licensing are needed. Audio begins after interaction and can be muted.
