# Coursework guide for evaluation

**Sudip Sah · Student ID 202637610 · Computer Engineering**

This repository contains my Web Programming exercises and projects. The [homepage](index.html) is the starting point for working pages. The [course map](COURSE_MAP.md) lists the individual exercises.

## Where to look

| Work | Readable source | What it covers |
|---|---|---|
| HTML and semantics | `week2/html-basics/`, `week2/semantic-html/` | Structure, links, tables, forms and semantic elements |
| CSS | `week3/lessons/`, `week3/exercises/`, `week3/advanced/` | Selectors, box model, positioning, transitions and responsive layouts |
| DOM exercises | `week4/exercises/` | Events, text updates, theme changes and task controls |
| StudyHub | `week4/studyhub/` | Timer, tasks, student search, profile dialog and attendance |
| Conditions and loops | `week5/` | Grade checking and loop examples |
| Fetch and APIs | `week6/` | Requests, loading states, response validation and errors |
| JokeLab | `week6/jokelab/` | Fetching jokes and saving favourites in browser storage |
| Book Search | `week7/` | Open Library requests and implementation steps |
| HTML form validation | `week8_1/` | Native constraints and labelled controls |
| JavaScript validation | `week8_2/` | Submit handling, feedback and password confirmation |
| Accessibility audit | `week9_1/` | Report page and retained PDF |
| Performance lab | `week9_2/` | Before/after pages, progressive fixes and audit evidence |
| Git and deployment | `week10/` | Exercises, portfolio, Book Search and deployment evidence |
| React introduction | `Week11 monday/project/src/` | StudentCard props and concept checks |
| React components | `Week11 friday/project/src/` | Student Directory, ProductCard, Course Catalog, Gallery and examples |
| Team project | `teamproject/` | Memory Match engine, rendering, tests, report and presentation |
| Portfolio React section | `week10/portfolio/src/` | Reusable project cards, technology filters and project details inside the portfolio |

## Source and build output

- Homepage source is in `assets/home/` and `assets/js/`. Production bundles are in `assets/optimized/`.
- React source is in each day's `project/src/`. Parent `assets/` folders and exercise entry HTML files are build output.
- `coursework/`, `projects/` and older capitalised week folders retain previous addresses. Review the current weekly source listed above.
- `evidence/` folders contain saved reports and screenshots. They are historical evidence, not current test results.
- The broken starter and before examples are kept for comparison with the completed solution.

The existing folder names and URLs are preserved so earlier submissions still open.

## Run and verify

Follow [START-HERE.md](START-HERE.md) for setup, source locations and build instructions.

```sh
npm run validate
```

The root command checks local HTML targets and JavaScript syntax, then runs the API, JokeLab, text reveal, timer and game tests. Each React project has separate `npm run check` and `npm run build` commands.

## What to demonstrate

- Search for a complete project title on the homepage and change the category filter.
- Add and complete a StudyHub task, search for a student's interest and toggle attendance. Try the keyboard and a narrow screen.
- Load, save and remove a JokeLab favourite. Reload to show that storage persists. Explain the loading and error states.
- Explain how Memory Match separates engine state from DOM rendering, including preview, mismatch, hints, scoring and time.
- Show how React props enter a component, how defaults apply, and how list items get keys.

## Scope

Checks help verify code and links; marks depend on the instructor's task list. API examples need internet access. Generated profiles and practice scores are demonstration data. Saved Lighthouse results apply to the dates and URLs recorded in those reports.
