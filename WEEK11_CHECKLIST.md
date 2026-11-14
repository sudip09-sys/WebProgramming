# Week 11 work

Sudip Sah · 202637610

## Code and working pages

| Item                                                               | Page                                                         | Readable source                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| ProductCard: name, KRW price, rating and stock state               | [Products](<Week11 friday/products.html>)                    | `Week11 friday/project/src/ProductCard.jsx`                                        |
| CourseCard: title, instructor, credits and required/elective badge | [Courses](<Week11 friday/courses.html>)                      | `Week11 friday/project/src/CourseCatalog.jsx`                                      |
| ProfileCard with default avatar                                    | [Practice](<Week11 friday/practice.html>)                    | `Week11 friday/project/src/practice.jsx`                                           |
| Notification list with conditional icons and stable keys           | [Practice](<Week11 friday/practice.html>)                    | `Week11 friday/project/src/practice.jsx`                                           |
| Card wrapper with two different children sections                  | [Practice](<Week11 friday/practice.html>)                    | `Week11 friday/project/src/practice.jsx`                                           |
| StudentProfileCard: exactly five props and three student cards     | [Student Directory](<Week11 friday/index.html>)              | `Week11 friday/project/src/StudentProfileCard.jsx`, `App.jsx`                      |
| ProjectCard, ProjectList and FilterBar                             | [Gallery exercise](<Week11 friday/gallery.html>)             | `Week11 friday/project/src/Gallery.jsx`                                            |
| React components inside my portfolio                               | [Portfolio: selected work](week10/portfolio/index.html#work) | `week10/portfolio/src/PortfolioProjects.jsx`, `ProjectArtwork.jsx`, `projects.mjs` |
| Greetings, list rendering, conditional alerts and grade threshold  | [Component examples](<Week11 friday/examples.html>)          | `Week11 friday/project/src/Examples.jsx`                                           |
| StudentCard and three introductory concept checks                  | [Monday](<Week11 monday/index.html>)                         | `Week11 monday/project/src/`                                                       |

The directory displays Sudip 202637610, Abinash 202637724 and Eric 202637684. Their supplied GPAs are 4.45, 4.39 and 4.22 respectively. The project history contains separate changes for components, content, styles and deployment.

The main portfolio now uses React for the selected-work section. Project data is passed into reusable cards, FilterBar changes the selected technology, and ProjectList renders the matching projects with stable IDs. The existing project artwork and manually controlled card navigation are retained. Four software projects have source and demo links; the video-editing card links to my editing profile.

## Run the checks

```sh
npm ci
npm run build:portfolio
npm run validate
```

The React exercise checks run separately:

```sh
npm ci --prefix "Week11 friday/project"
npm run check --prefix "Week11 friday/project"
```

After editing portfolio components, rebuild `week10/portfolio/assets/projects.min.js` with `npm run build:portfolio`. The rest of the portfolio uses `app.js` for its theme, menu, skills, motion and contact controls.

## Submission checks

Code in the repository does not confirm submission on the course platform. Before submitting, confirm the correct quiz/session, the repository and live links requested, the genuine in-class activity code, and a screenshot of the running directory showing the student ID. The supplied screenshot remains with the directory. Monday's remaining tasks and evaluation timing should be checked against the latest class instructions.
