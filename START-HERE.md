# Run and edit the coursework

Sudip Sah · 202637610 · Web Programming

Open the repository folder in VS Code. Extract a downloaded ZIP before opening it.

## Run the site

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. Published pages do not need a build to run. Use a server instead of opening HTML files directly because some examples use JavaScript modules.

## Source locations

| What to edit | Source |
|---|---|
| Homepage layout | `index.html` |
| Homepage styles | `assets/home/styles.css`, `assets/home/premium.css`, `assets/home/project-art.css` |
| Homepage search | `assets/home/home.mjs` |
| Portfolio React projects and filters | `week10/portfolio/src/` |
| Homepage animation | `assets/home/experience.mjs`, `assets/home/text-reveal.mjs` |
| Idea Mixer | `assets/js/idea-mixer.js` |
| Shared coursework theme | `assets/css/course-theme.css`, `assets/js/course-theme.js` |
| Coursework navigation data | `assets/js/course-catalog.js` |
| Weekly exercises | Numbered weekly folders; see [COURSE_MAP.md](COURSE_MAP.md) |
| StudyHub | `week4/studyhub/` |
| JokeLab | `week6/jokelab/` |
| Book Search | `week7/solution.html`, `assets/js/books.js` |
| Memory Match | `teamproject/engine.mjs`, `teamproject/game.mjs`, `teamproject/style.css` |
| Monday React | `Week11 monday/project/src/` |
| Friday React | `Week11 friday/project/src/` |

The homepage loads optimized bundles. Rebuild them after changing the corresponding source:

```sh
npm ci
npm run build:performance
```

Rebuild the portfolio's React section separately with `npm run build:portfolio`.

## Check the work

```sh
npm ci
npm run validate
```

This checks local HTML targets and JavaScript syntax, including `.mjs` modules, then runs the tests in `tests/`, `scripts/` and the game engine, plus the portfolio React check. Monday and Friday app checks run inside their own project folders.

## React projects

Use Node.js 24 to match the runtime used for this cleanup. Each React project needs its own dependencies. From the repository root:

```sh
cd "Week11 friday/project"
npm ci
npm run check
npm run dev
```

Use the same commands inside `Week11 monday/project` for Monday. After editing, run `npm run build` inside that project. Its postbuild script copies output into the published parent folder. Commit source and generated output together.

See [EVALUATION.md](EVALUATION.md) for the folder guide and demonstration checklist.
