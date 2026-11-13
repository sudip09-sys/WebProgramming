# Week 11 — how to finish and submit

The Monday and Friday coding exercises are in separate folders. The public site and source are in the existing WebProgramming repository.

## 1. Work through Monday

Open Week11 monday/index.html, then the StudentCard lab. Review project/src/StudentCard.jsx and project/src/App.jsx. Complete the instructor's original visual lecture yourself, including its quick checks. Save the activity code displayed by that lecture and capture a screenshot showing your name and ID.

## 2. Work through Friday

Open Week11 friday/tasks.html. Follow the five items in order: ProductCard, Course Catalog, study-guide practice, Task 11-A, and Portfolio Gallery. The hub links to each working page.

Try the gallery filters: All = 3 projects, JavaScript = 2, React = 1, API = 1, CSS = 3. Open the source and demo links.

The courses and products are explicitly marked as sample exercise data. Gallery projects point to existing coursework.

## 3. Missing academic information

All three directory cards are Year 1 Computer Engineering. Confirmed IDs: Sudip 202637610, Abinash 202637724, Eric 202637684. University GPAs remain Not provided. Supply real values or ask the instructor how to handle an unavailable GPA; no result is fabricated. Eric's full name has not been supplied.

## 4. Review and evidence

Understand the code before presenting it: a component returns JSX; props flow from parent to child; .map() renders lists; stable keys identify list items; ternaries choose output; children holds nested JSX; useState remembers the selected gallery filter.

Capture real screenshots from the running pages. Task 11-A's screenshot must show ID 202637610. Do not claim screenshots or a personal lecture activity have been completed merely because the code is built.

## 5. Submit the appropriate items

Repository: https://github.com/sudip09-sys/WebProgramming

Monday hub: https://sudip09-sys.github.io/WebProgramming/Week11%20monday/

Task 11-A live app: https://sudip09-sys.github.io/WebProgramming/Week11%20friday/

Portfolio Gallery: https://sudip09-sys.github.io/WebProgramming/Week11%20friday/gallery.html

For Task 11-A: repository URL, live app URL, your genuine in-class activity code and a screenshot. Use the task's self-check where available. Submit through the correct course form.

For Portfolio Gallery: submit the repository URL on Cybercampus before the next class, per the PDF. Include the direct gallery link if the submission allows a note.

No quiz, attendance confirmation, or course submission has been sent by this implementation.

## Local workflow

From the repository root, choose one:

```sh
cd "Week11 monday/project"
```

or:

```sh
cd "Week11 friday/project"
```

Then:

```sh
npm ci
npm run check
npm run dev
```

After editing, stop the development server with Ctrl+C, run npm run build, then return to the repository root (cd ../..) and commit/push the changed source and generated files. Keep the existing Pages deployment; do not replace it with a separate gh-pages branch.
