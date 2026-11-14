# CodeRabbit review fixes

Reviewed snapshot: `9ba651d88db0767f0a3ae91c3cd2c9d5af5861bd`.

49 reported issues: 47 addressed, 2 false positives. Duplicate reports against historical and current paths are counted separately, as in the original review. The changes are prepared on a review branch; this file does not claim a clean CodeRabbit rerun.

## Changes

- Fix nested 404 assets, original-text project search, theme contrast, storage failure handling, and motion preferences.
- Make StudyHub countdowns use elapsed milliseconds and restart correctly; preserve task and attendance focus, use a named native modal, and retain navigation on mobile. Apply matching timer/task fixes to the retained legacy script.
- Validate restored favourites, refresh storage before changes, synchronize tabs, restore removal focus, and honor reduced motion.
- Fix file URL conversion and Windows path checks; keep the local server alive after file stream errors.
- Correct game preview timing and the presentation's test command; regenerate the affected optimized bundles.
- Add document language and dialog names; move late encoding declarations before inline styles; escape the literal style tag and remove heading-size overrides from the heading exercise.
- Prevent no-JavaScript submission of local-only demos and keep API request URLs paired with their responses.
- Fix the HTML export callback in eight saved Lighthouse reports. Export omits the already rendered report, without changing the embedded audit JSON or scores.

## Validation

- `node scripts/check.mjs`: 290 HTML pages and 216 JavaScript sources; 0 errors.
- `node --test scripts/*.test.mjs teamproject/engine.test.mjs`: 16 tests pass, including five added regressions for timer restart/elapsed time, malformed favourites, and preview timing.
- `npm run build:performance`: succeeds on Windows and rebuilds published optimized assets.
- Monday `npm run build` and `npm run check`: succeed; published runtime is unchanged.
- Isolated Chrome checks: full-title search, filters, saved-idea focus, delayed/pause/resume/restart timer, mobile navigation, directory interests, task/attendance focus, modal Escape/focus restoration, malformed storage, cross-tab favourites, Monday React pages, CSS lesson, API explorer, and disabled demo forms without JavaScript pass.

## Issue disposition

| Severity | Reported file | Report | Disposition |
|---|---|---|---|
| minor | `404.html` | Resolve error-page assets from the project root. | Fixed: use /WebProgramming/assets/ for all three assets. |
| major | `Week11 monday/assets/src-sk2W6Rgy.js` | Handle a null resource state before reading e.stylesheets. | Not reproduced / false positive: the surrounding short-circuit condition only calls eh after constructing a resource state. Both published Monday entrypoints rendered without browser exceptions; rebuilding reproduced the same bundle. |
| minor | `Week4_1/script.js` | Handle Start after a completed session. | Fixed; see changes and validation below. |
| minor | `Week4_1/script.js` | Calculate the countdown from elapsed time. | Fixed; see changes and validation below. |
| minor | `Week4_2/style.css` | Give the light profile demonstration an explicit foreground color. | Fixed; see changes and validation below. |
| minor | `Week4_1/script.js` | Associate each checkbox with its task title. | Fixed; see changes and validation below. |
| minor | `Week6_Random_Joke_Fetcher/script.js` | Validate each restored favourite. | Fixed; see changes and validation below. |
| minor | `assets/css/course-theme.css` | Use a tone-specific primary-button foreground. | Fixed; see changes and validation below. |
| minor | `Week6_Random_Joke_Fetcher/script.js` | Let the reduced-motion rule control scrolling. | Fixed; see changes and validation below. |
| major | `assets/home/premium.css` | Preserve the hidden state of filtered cards. | Not reproduced / false positive: index.html already declares [hidden]{display:none!important}; browser filtering passes. No redundant CSS added. |
| minor | `assets/home/home.mjs` | Search the original text, not the reveal overlays. | Fixed; see changes and validation below. |
| minor | `assets/js/idea-mixer.js` | Restore keyboard focus after removing a saved idea. | Fixed; see changes and validation below. |
| minor | `assets/js/course-theme.js` | Preserve the user's Motion off choice. | Fixed; see changes and validation below. |
| minor | `assets/js/mini-pet.js` | Reset `moved` when a drag ends, or a later click can be swallowed. | Fixed; see changes and validation below. |
| minor | `assets/js/spider.js` | Skip the mini-pet loader when `spider.js` runs as an inline script. | Fixed; see changes and validation below. |
| minor | `java.js` | Keep UI initialization independent of theme storage. | Fixed; see changes and validation below. |
| minor | `style.css` | Keep the about section readable in dark mode. | Fixed; see changes and validation below. |
| major | `scripts/build-performance.mjs` | Convert file URLs with `fileURLToPath`. | Fixed; see changes and validation below. |
| minor | `scripts/serve.mjs` | Handle errors from the file stream. | Fixed; see changes and validation below. |
| major | `scripts/check.mjs` | Normalize the relative path before comparing it on Windows. | Fixed; see changes and validation below. |
| minor | `teamproject/presentation.html` | Keep the engine-test command on one shell line. | Fixed; see changes and validation below. |
| minor | `teamproject/game.mjs` | Deduct elapsed time after the preview deadline. | Fixed; see changes and validation below. |
| minor | `week2/html-basics/Task8_Buttons.html` | Declare the document language. | Fixed; see changes and validation below. |
| minor | `week2/html-basics/Task9_Forms.html` | Declare the document language. | Fixed; see changes and validation below. |
| minor | `week2/html-basics/Task10_SemanticsHtml.html` | Declare the document language. | Fixed; see changes and validation below. |
| minor | `week2/html-basics/task1_basicHTMLstructure.html` | Declare English as the document language. | Fixed; see changes and validation below. |
| major | `week2/html-basics/week_1All Fundamentals.html` | Prevent the example form from putting passwords in the URL. | Fixed; see changes and validation below. |
| minor | `week2/semantic-html/Task7_Article.html` | Declare the language of the English lessons. | Fixed; see changes and validation below. |
| minor | `week2/semantic-html/dialog.html` | Associate the dialog with its heading. | Fixed; see changes and validation below. |
| minor | `week3/exercises/E1_Style_First_Heading.html` | Let the exercise rule control the heading size. | Fixed; see changes and validation below. |
| major | `week3/lessons/Topic_02_Three_Ways_to_Add_CSS.html` | Escape the literal `&lt;style&gt;` in the explanation. | Fixed; see changes and validation below. |
| minor | `week3/lessons/Topic_18_Box_Model_Width_Calculation.html` | Move the charset declaration before the inline stylesheet. | Fixed; see changes and validation below. |
| minor | `week4/exercises/style.css` | Keep the light profile readable in site dark mode. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Measure elapsed time instead of counting interval callbacks. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/index.html` | Include every displayed interest in the search metadata. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Preserve the focused attendance button after a toggle. | Fixed; see changes and validation below. |
| major | `week4/studyhub/style.css` | Keep StudyHub navigation available on mobile. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Reset completed timer state before starting another session. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Preserve keyboard focus when task rows change. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Manage focus for the profile modal. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/index.html` | Associate labels with the form controls. | Fixed; see changes and validation below. |
| minor | `week4/studyhub/script.js` | Give each task checkbox its task title as an accessible name. | Fixed; see changes and validation below. |
| minor | `week6/jokelab/script.js` | Let the reduced-motion CSS control scrolling. | Fixed; see changes and validation below. |
| minor | `week6/jokelab/script.js` | Restore keyboard focus after removing a favourite. | Fixed; see changes and validation below. |
| minor | `week7/api-explorer.html` | Keep the response associated with its request URL. | Fixed; see changes and validation below. |
| minor | `week8_2/E3_Password_Confirmation.html` | Prevent password transmission when JavaScript is unavailable. | Fixed; see changes and validation below. |
| minor | `week9_2/evidence/team-before.report.html` | Exclude the rendered report from HTML exports. | Fixed; see changes and validation below. |
| minor | `week9_2/lab/solution.html` | Prevent native submission of the demo newsletter form. | Fixed; see changes and validation below. |
| minor | `week6/jokelab/script.js` | Re-read stored favourites before each change, and listen for the `storage` event. | Fixed; see changes and validation below. |

