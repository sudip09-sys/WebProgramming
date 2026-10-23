# Week 8 Friday — Forms & HTML5 Validation

Completed by SAH SUDIP for K0126002, Gachon University.

## Activities
- [E1 · Login form](E1_Login_Form.html): POST, labels, required email/password and a checkbox.
- [E2 · Validation attributes](E2_Validation_Attributes.html): Nine-digit student ID, password rules and age 16–100.
- [E3 · CSS validation states](E3_Validation_Styles.html): Green/red borders, a blue focus ring and age 18–65.
- [Student registration](HW_Student_Registration.html): Two fieldsets, complete validation and the bonus slider.
- [Personal-site contact form](HW_Contact_Form.html): Name, email, subject and message, ready to try.

## Open and submit
Open index.html for the lab, or an individual HTML file directly.
Every exercise/homework contains its own CSS and JavaScript; no build or installation is needed.
The study guide requests a single HTML file: submit HW_Student_Registration.html.
The PDF separately requests a contact form on your personal site: HW_Contact_Form.html is linked from Web Studio.
Confirm with your professor if only one of the two homework tasks is required.

## What works
Native HTML validation blocks invalid submissions. A submit handler prevents actual navigation and shows an explicit demo confirmation.
The action paths /login, /register, /validate and /contact illustrate backend routes; no backend is supplied.
GitHub Pages cannot process these POST routes itself. No credentials or messages are saved or sent.
Use practice values rather than real passwords. Removing the demo handler requires connecting a real backend first.

## Test checklist
- All forms: submit empty; required controls should block submission.
- E1: malformed email fails; remember-me is optional.
- E2: ID 12345678 fails; 202637610 passes. Type seven password characters (fail), then eight (pass).
- E2 age: 15 and 101 fail; 16 and 100 pass.
- E3: empty fields neutral; invalid typed values red; valid green; focus blue.
- E3 age: 17 and 66 fail; 18 and 65 pass.
- Registration: nine-digit ID and 8+ password required.
- Phone: empty allowed; 01012345678 fails; 010-1234-5678 passes.
- Registration: terms must be checked. Slider displays 0 through 10 as moved.
- Contact: name minimum 2, subject minimum 3, message 10–1000 characters.
- Click labels to focus controls. Tab through controls to see focus outlines.
- Valid submits show demo confirmation without reloading or sending data.

## Key concepts
action = destination; method = submission method; id = element identity; name = submitted key.
fieldset groups related fields; legend names the group. Explicit labels use matching for/id.
required prohibits empty values; pattern checks the entire nonempty value.
minlength/maxlength constrain text; min/max constrain numbers or dates.
:not(:placeholder-shown) is an empty-field guard only for controls with supported placeholders, not a universal touched-state flag.
POST does not encrypt data; use HTTPS in real applications. Real backends must validate again.
No novalidate is used because this lesson relies on native submit validation.

## Sources
Your supplied WebPro_Week6_Mon_StudyGuide text, the 13-slide VideoLecture transcript and WebPro_Week6_Mon_Forms_v2.pdf.
