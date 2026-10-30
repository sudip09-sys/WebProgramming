# Week 8 Friday — JavaScript form validation
Sudip Sah · 202637610 · K0126002

## Activities
- [E1 · Prevent submit](E1_Prevent_Submit.html): Custom username errors and a welcome message.
- [E2 · Real-time email](E2_Realtime_Email.html): Validity API, custom feedback and validation classes.
- [E3 · Password confirmation](E3_Password_Confirmation.html): Cross-field checks, setCustomValidity and ARIA.
- [Homework · Registration](HW_JS_Registration.html): All-field validation, accessible errors and the bonus submit guard.

Each activity is a standalone HTML file with embedded CSS and JavaScript.
The homework preserves Monday's personal/account groups and experience slider, adds password confirmation, and requires a formatted phone number.
No form data is transmitted or stored. Successful validation is a demonstration, not real account registration.

## Source and scope
[Instructor's Friday study guide](https://muxiddin19.github.io/WebPro/week7/WebPro_Week6_Fri_StudyGuide.html).
The instructor calls this Week 8 Friday; the source filename says Week 6 Friday.
Implements the original guide's E1–E3 and homework. The v2 guide's separate C1–C3 challenges are supplementary and are not claimed here.
E2 follows the prose requirement for a required message after clearing an edited field, while removing border classes. The supplied starter/solution instead clears all messages; this difference is intentional.

## Manual checks
- E1: empty or whitespace username produces error; a name produces a welcome without navigation.
- E2: initial neutral; malformed email red; valid email green; cleared email neutral with required message.
- E3: short password fails; mismatched confirmation fails; matching succeeds; changing original password invalidates confirmation again.
- Homework: initial Register disabled with no visible field errors; 8-digit/alphabetic IDs, malformed email, short password, bad phone and missing terms keep it disabled.
- Valid example: Sudip Sah / 202637610 / sudip@example.com / Practice123 (twice) / 010-1234-5678 / terms checked.
- Editing any field clears success. A password change rechecks confirmation. Reset clears feedback and disables Register.
- Keyboard focus is visible; every control has a label and a linked live error span.
