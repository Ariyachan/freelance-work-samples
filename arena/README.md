# Autonomous Arena: decision-making demonstration

Self-initiated, generic 3v3 simulation by Ariyachan. Not prior client work and not an implementation of Tilt's rules.

Download `Autonomous-arena-demonstration.html` and open it in a modern browser. It is a self-contained file: no server, tracking, network requests, third-party art, or dependencies. The controls select a seed and tackle intensity; New match applies them.

The agents pursue possession, support teammates, pass under pressure, shoot, and attempt tackles. Attributes vary by seed. Matches last 60 simulated seconds and use a fixed timestep.

## Evidence and limits

`node verify-arena.cjs` runs 12 complete matches and checks finite coordinates, player bounds, deterministic same-seed replay, passing/shooting/scoring, different scorelines, and zero tackles when tackle intensity is disabled. It passed on Node 22.18.0. Engine tests exposed and helped fix a goal-boundary bug.

The browser UI has not been visually verified in the current environment. Physics and AI are intentionally basic: no obstacle navigation, contact physics, animations, production balancing, or rules from any buyer. The engine is JavaScript, not proof of prior Godot/Unity/Unreal work.

For a commissioned prototype, agree actual rules, engine, acceptance criteria, source ownership, budget and payment before implementation.
