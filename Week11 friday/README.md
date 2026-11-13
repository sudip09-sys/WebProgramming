# Week 11 Friday: React Components & Props

**Sudip Sah · 202637610**

[Student directory](./index.html) · [Study guide exercises](./practice.html)

Task 11-A displays exactly three student cards: Sudip Sah, Abinash Lamichhane, and Eric. The reusable `project/src/StudentProfileCard.jsx` receives exactly five props: `name`, `studentId`, `major`, `year`, and `gpa`.

The practice page includes ProfileCard with a default local avatar, a keyed notification list with conditional icons, and a Card wrapper using children in two different sections. All styling is custom CSS, using the black-and-red palette, condensed headings and outlined typography of Sudip’s portfolio. Both pages link back to coursework and the portfolio.

## Run and build

```sh
cd "Week11 friday/project"
npm ci
npm run dev
```

To rebuild the files served by GitHub Pages:

```sh
npm run build
```

Vite builds into `project/dist/`. The postbuild script copies those generated files into the parent `Week11 friday/` folder, alongside this README. Commit the updated HTML and assets to the existing WebProgramming repository. Do not deploy a separate gh-pages branch: this coursework uses the existing site's deployment.

Relative asset paths support the space in the folder name. The local project is under `project/`; the parent HTML and assets are generated deployment output.

## Details to confirm

University GPAs have not been supplied. Student IDs are confirmed: Sudip 202637610, Abinash 202637724, and Eric 202637684. Eric's full name has not been provided. All three students are Year 1 Computer Engineering students, as confirmed by Sudip. Unconfirmed fields show **Not provided**. Replace these values in `project/src/App.jsx`, then rebuild. Do not substitute a high-school GPA for a university GPA.

## Submission

Submit this repository, the live directory page, your in-class activity code, and a screenshot of the running app showing ID 202637610 through the correct course form. The activity code must come from class.

## Validation

Production build and actual React server rendering passed: exactly three student cards, all required props, visible student ID, three practice exercises, conditional icons, default avatar and nested children. Local browser testing was blocked by the execution environment. Browser validation and public deployment checks are recorded separately; no screenshot is fabricated.

## References

- [Task 11-A](https://muxiddin19.github.io/WebPro/week10/WebPro_Week11_Fri_Task11A_ReactProps.html)
- [Study guide](https://muxiddin19.github.io/WebPro/week10/WebPro_Week11_Fri_StudyGuide.html)
