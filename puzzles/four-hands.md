# Four Hands, One Signal

Independent paper-design sample by Ariyachan. Created for portfolio review; not a shipped game, past client commission, or a design using the prospective client's confidential mechanics. The four roles below are invented for this example.

## Room and objective

Four specialists restore a lighthouse signal to open the next room. A central apparatus displays four persistent settings: route R, lens L, pressure P, and timing T. Each setting has four positions, numbered 0–3 on this paper prototype. In a playable version, use distinct symbols as well as labels; never encode necessary information by colour alone.

Four alcoves surround the apparatus. Players can see its settings and talk freely, but only their specialist can operate their own control or inspect its local diagnostic instrument. There is no player-count pressure plate, timed simultaneous button press, lethal reset, or prerequisite that prevents one player starting before another finishes.

```text
                 NAVIGATOR
                route selector R
                       |
  ENGINEER ------ shared signal ------ OPTICIAN
 pressure mixer P    R / L / P / T     lens rack L
                       |
                  ARCHIVIST
                 timing drum T

               EXIT: aligned signal
```

## What each specialist actually does

| Role | Exclusive control | Private evidence | Information they need from the team |
|---|---|---|---|
| Navigator | Select one of four beam routes, R | A tide chart shows which route stays clear for each timing window | The archivist's proposed timing |
| Optician | Insert one of four lens assemblies, L | A sliding calibration card combines route and pressure to identify the lens | Navigator's route and engineer's pressure |
| Engineer | Set a four-position pressure mixer, P | A load chart relates the route's length and lens resistance to required pressure | Route and installed lens |
| Archivist | Rotate the signal timing drum, T | A phase wheel combines pressure and lens delay to find a valid timing window | Pressure and lens |

Changing any control broadcasts its new labelled setting and invalidates any now-inconsistent diagnostic. Players may inspect and propose settings at any time. The charts describe constraints on the **current shared machine**; they do not award four independent codes that can be solved once and forgotten.

## Print-and-play evidence cards

Give each player only their role's card initially. These tables are the complete rules of this small prototype, not placeholders for unspecified puzzles. Rows and columns are labelled on the physical cards.

**Navigator: timing → required route**

| T | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Required R | 1 | 2 | 3 | 0 |

**Optician: required lens L, indexed by route R and pressure P**

| R \\ P | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 0 | 1 | 2 | 3 |
| 1 | 1 | 2 | 3 | 0 |
| 2 | 2 | 3 | 0 | 1 |
| 3 | 3 | 0 | 1 | 2 |

**Engineer: required pressure P, indexed by route R and lens L**

| R \\ L | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 0 |
| 1 | 3 | 0 | 1 | 2 |
| 2 | 1 | 2 | 3 | 0 |
| 3 | 3 | 0 | 1 | 2 |

**Archivist: required timing T, indexed by pressure P and lens L**

| P \\ L | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 1 | 3 | 1 | 3 |
| 1 | 2 | 0 | 2 | 0 |
| 2 | 3 | 1 | 3 | 1 |
| 3 | 0 | 2 | 0 | 2 |

The exit opens only while all four relationships hold. Start at R=0, L=0, P=0, T=0; do not start at the solution. Each specialist's instrument reports whether their relationship holds, without revealing another specialist's private chart.

## Worked solution and a failed hypothesis

The unique joint solution is **R=1, L=0, P=3, T=0**. Timing 0 requires route 1; route 1 with pressure 3 requires lens 0; route 1 with lens 0 requires pressure 3; pressure 3 with lens 0 requires timing 0.

For example, the team might try route 1, lens 1, pressure 0, timing 0. Navigator, optician, and engineer are satisfied, but the archivist's chart requires timing 3. Changing timing alone would invalidate the navigator's route. This makes the last contradiction a shared problem, not an instruction to wait for the archivist to finish a separate puzzle.

## Keeping all four involved

- Initial inspection happens in parallel, with a useful instrument at every station.
- When the team proposes a configuration, every player checks a different relationship. Use explicit reports such as “route valid, but only if timing stays at 0,” instead of an unexplained green light.
- A player who has found a locally valid setting still has a reason to participate: another change can invalidate it. They can explain constraints, reject a hypothesis, or operate the setting needed to test one.
- Do not add busywork to manufacture activity. The design removes forced waiting gates, but cannot guarantee equal participation or prevent a confident player directing the others.

## What is established, and what still needs testing

Exhaustive enumeration of all 256 configurations verifies that the printed rules have exactly one joint solution. All positions remain reachable, and a wrong hypothesis consumes no permanent resource, so the abstract control model has no irreversible dead end.

This is a coupling and communication sample, **not a validated difficulty curve**. No four-person playtest has been run. The tiny tables may be too easy, and a group could consolidate the clues under one leader. Before expanding the room, test with four actual players and record longest involuntary idle interval per player, who proposes/rejects hypotheses, time to first shared contradiction, and whether they solve through reasoning or enumeration. Long idle intervals or one-player domination require redesign; extra buttons or arbitrary timers are not fixes.

For the prospective project, role abilities and information presentation would need adapting after the actual mechanics are shared. A paid trial should define the expected page count/layout detail, one review round, budget, and acceptance criteria before work starts. No NDA or client-specific scope has been accepted here.
