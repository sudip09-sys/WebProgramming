# Repository cleanup notes

## Changes

- Formatted 254 authored HTML, CSS, JavaScript, JSX and configuration files with consistent indentation and line breaks. Generated bundles, historical audit evidence, compatibility pages and intentional before examples were kept separate.
- Corrected the source locations in START-HERE.md and added EVALUATION.md as a guide to the weekly folders, projects and demonstrations.
- Added `npm start`, `npm run check`, `npm test` and `npm run validate` at the root. The test command now includes both tests/ files as well as the scripts/ and game tests.
- Extended the checker to include .mjs modules.
- Updated the JokeLab test browser mock for storage events and added a cross-tab storage regression test. The broader baseline run exposed six failing tests caused by that missing mock API; those tests are now included and pass.
- Updated both React publishers to remove obsolete hashed JavaScript and CSS build files. Supplied images and saved evidence are retained. Current bundles were regenerated from source.

## Results

| Check | Result |
|---|---|
| Local HTML links and JavaScript syntax | 290 HTML pages and 237 JavaScript sources; no errors after generated-file cleanup |
| Full root test command | 32 tests pass |
| Monday React component checks and production build | Pass |
| Friday React component checks and production build | Pass |
| Optimized homepage/game build | Pass |
| Targeted Chrome checks | Homepage filters and search, Idea Mixer focus, StudyHub timer/mobile controls/modal, favourites/storage, Monday React pages, CSS lesson, API explorer and no-JavaScript forms pass |
| Local HTML filename casing | No mismatches found |

Formatting of the authored JavaScript and JSX was also compared through the compiler. Apart from the listed checker, test-harness and publishing changes, the compiled JavaScript was unchanged. CSS differences were whitespace in custom property values and function arguments.

## How to use this for evaluation

Start with README.md and EVALUATION.md, then open the numbered weekly source folders. Read React components under each day's project/src/ rather than the bundled assets. The course map preserves links to individual exercises and older submission URLs.

These results cover the repository checks and the named browser flows. They do not certify every interaction on every page or replace the instructor's requirements. External APIs need internet access, and saved audit reports describe their original capture dates.
