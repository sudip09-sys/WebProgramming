# Sudip Sah - Web Programming

Coursework and projects arranged by week.

[Open coursework](https://sudip09-sys.github.io/WebProgramming/) · [Course map](COURSE_MAP.md) · [Evaluation guide](EVALUATION.md) · [Source and setup](START-HERE.md)

## Weekly coursework

- [Week 2 - HTML basics & semantic HTML](week2/index.html)
- [Week 3 - CSS fundamentals & advanced CSS](week3/index.html)
- [Week 4 - JavaScript & the DOM](week4/index.html)
- [Week 5 - Conditions & loops](week5/index.html)
- [Week 6 - Fetch & API projects](week6/index.html)
- [Week 7 - Book Search lab](week7/index.html)
- [Week 8 Monday - Forms & HTML5 validation](week8_1/index.html)
- [Week 8 Friday - JavaScript form validation](week8_2/index.html)
- [Week 9.1 - Accessibility audit](week9_1/index.html)
- [Week 9.2 - Performance report and audit evidence](week9_2/index.html)
- [Week 10 - Git and deployment submission](week10/index.html)
- [Week 10_2 - Accessibility modifications report](week10/report.html)
- [Week 11 Monday - React introduction and lab](<Week11 monday/index.html>)
- [Week 11 Friday - React tasks, props and homework](<Week11 friday/tasks.html>)

## Projects

- [Memory Match](teamproject/index.html)
- [StudyHub](week4/studyhub/index.html)
- [JokeLab](week6/jokelab/index.html)
- [BookFinder](week7/solution.html)

## Run locally

Open this folder in VS Code. With Node.js 18 or newer, run:

```sh
node scripts/serve.mjs
```

Then open http://127.0.0.1:4173. No build or package installation is needed. You can also use VS Code’s Live Server extension. Run `npm run validate` to check local links, JavaScript syntax and all root-level test suites.

## Folder guide

- `week2/` through `week7/`: lessons and assignments in sequence.
- `week8_1/`: Week 8 Monday forms.
- `week8_2/`: Week 8 Friday JavaScript validation.
- `week9_1/`: accessibility report and PDF.
- `week9_2/`: performance report and audit evidence.
- `week10/`: Git and deployment hub, portfolio, Book Search, keyboard modifications report and historical Lighthouse evidence.
- `Week11 monday/project/` and `Week11 friday/project/`: readable React source, checks and Vite builds.
- `teamproject/`: shared Memory Match project.
- `assets/`: shared styles, scripts and images.
- `scripts/`: local server and checks.
- Legacy exercise URLs retain compatibility pages.

## API examples

Week 6 includes JokeAPI (safe-mode programming jokes with an eight-second request timeout), JSONPlaceholder, Open-Meteo, Random User, PokéAPI and countries.dev examples. Book Search uses Open Library. These demos depend on external service availability. Generated profiles are sample data.

## Performance homework

[Week 9.2 report and audit evidence](week9_2/index.html). Rebuild optimized assets with `npm ci` then `npm run build:performance`; readable sources remain in their original folders. React builds and checks use Node.js 24; see START-HERE.md for the separate setup commands.
