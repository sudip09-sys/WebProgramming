# Week 11 Friday — task order

1. [ProductCard](./products.html) — built: four props, KRW price, rating /5, and both stock states.
2. [Course Catalog](./courses.html) — built: the three supplied sample courses, CourseCard, .map(), stable keys, and required/elective badges.
3. [Study guide practice](./practice.html) — built: default avatar, conditional notification list, and Card with children.
4. [Task 11-A student directory](./index.html) — built: exactly three cards, five props, confirmed names/IDs/majors/years, original CSS, commits and deployment.
5. [Portfolio Gallery](./gallery.html) — built: ProjectCard, ProjectList, technology FilterBar, and three existing projects with source/demo links.

## Before submission

- [ ] Review the code and be able to explain props, .map(), keys, children, and filtering.
- [ ] Supply actual university GPAs, or ask the instructor what to show if no GPA is available yet. Do not invent values or substitute high-school results.
- [ ] Complete your original lecture activity and save its activity code.
- [x] Capture real screenshots of the running pages, including ID 202637610 on Task 11-A (supplied in the evidence archive).
- [x] Run local checks with npm run check. The instructor's online checker is currently broken: its textarea includes the button and script as text, so there is no usable Check button. This is not an instructor-issued passing result.
- [ ] Submit repository URL, live URL, activity code and screenshot through the correct Task 11-A course form.
- [ ] Submit the Portfolio Gallery homework repository URL through Cybercampus as instructed in the PDF.

Task 11-A and Portfolio Gallery are separate assignments. Task 11-A's page states next Friday at class start; the PDF gallery homework says before the next class. Check the actual course submission dates.

## Run locally

From the repository root:

```sh
cd "Week11 friday/project"
npm ci
npm run check
npm run dev
```

Use the local address printed by Vite, then open index.html, products.html, courses.html, practice.html, or gallery.html. Run npm run build to regenerate the published files in the parent Friday folder.

## Explain the implementation

- StudentProfileCard receives five read-only props. Exactly three usages stay in App.jsx.
- ProductCard formats a number as a KRW price and chooses stock text with a ternary.
- CourseCatalog maps an array to CourseCards, using course IDs as keys.
- ProfileCard supplies a default avatar when no avatarUrl is passed.
- NotificationList maps its array; NotificationItem chooses an icon by type.
- Card displays nested content through children.
- Gallery stores the selected technology in useState. All shows all three projects; a technology selection uses .filter() before ProjectList renders the results.

[Friday hub](./tasks.html) · [Monday hub](<../Week11 monday/index.html>) · [Submission guide](../WEEK11_SUBMISSION.md)
