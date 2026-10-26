# Memory Match — team project
A standalone extension of the Memory Match idea in Sudip Lab. Runs on GitHub Pages with no build or installation.

## Play
Open index.html using a local HTTP server, or open the deployed /WebProgramming/teamproject/ URL.
Choose difficulty and mode, then Start. Settings changes apply on restart.
Easy: 6 pairs / 120 seconds / 3 hints. Medium: 8 / 100 / 2. Hard: 12 / 90 / 1.
Timed challenge counts down even in background tabs. Practice has no timer.
Two-player duel is local: a match keeps the turn; a mismatch passes it. Most pairs wins.
Each match earns 100 points plus 25 per consecutive previous match, capped at 200.
A mismatch resets the streak. Peek shows cards for one second and deducts 50 points, floored at zero.

## Understand the code
- index.html: controls, scoreboard, board, and instructions.
- style.css: responsive layout and card states.
- engine.mjs: plain game data and rules, independent of the browser.
- game.mjs: buttons, rendering, and timers.
- engine.test.mjs: rule checks. Run node --test teamproject/engine.test.mjs from the repository root.

### Follow one turn
1. choose() updates the clock, then calls flip().
2. flip() ignores locked, matched, or already-open cards.
3. Two equal symbols become matched; score and pair count increase.
4. Different symbols set phase to mismatch, preventing a third flip.
5. After 800 ms, settle() hides the pair and switches the player in duel.
6. render() updates the existing buttons and scoreboard.

### Game phases
playing → mismatch → playing; playing → hint → playing.
The final pair changes phase to won. The timed clock reaching zero changes it to lost.
Restart cancels both timers before creating a fresh game.
The shuffle is Fisher–Yates: each remaining position swaps with a random earlier position.

## Suggested four-person division
Agree these roles with the team; these are proposed responsibilities, not a record of completed contributions.
1. HTML, instructions, and accessibility.
2. CSS, mobile layout, and presentation.
3. Matching, scoring, difficulty, and duel rules.
4. Timer, hints, integration, and tests.

## Demo outline
Show a match, a mismatch, a combo, one hint, then restart in hard mode.
Show duel turn changes, then explain flip() using two card indexes.
Use practice mode to explain the rules without time pressure.

## Scope
This is a playable project, not a submitted proposal or claim of professor approval.
No backend, accounts, online multiplayer, or saved scores are included.

