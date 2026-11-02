# Week 9.2 - Accessibility and performance

Open [the coursework hub](index.html).

## Submitted homework

The existing six-page PDF, personal-site and team-project evidence, and two-sentence summary remain available from the hub. These original homework measurements are distinct from the practice/lab measurements below.

## Completed practice exercises

- [E1: Lighthouse](exercises/E1_Lighthouse.html): starter, optimized page, actual metric answers, before/after screenshots, HTML reports and raw JSON.
- [E2: responsive images](exercises/E2_Responsive_Images.html): actual 400w/800w WebP and JPEG assets, picture fallback, dimensions, descriptive alt text, currentSrc display and measured file sizes.
- [E3: script loading](exercises/E3_Script_Loading.html): an external deferred app script, independent async analytics example, DOM readiness check, working button and observed execution timeline. No telemetry is sent.

## Completed seven-step lab

- [Lab guide](lab/index.html): explanations, code snippets, measured contrast table and actual audit evidence.
- [Original starter](lab/broken.html): downloaded unchanged from https://muxiddin19.github.io/WebPro/week8/lab/broken.html on 2 November 2026. Intentional accessibility/performance failures remain for comparison.
- `lab/step1.html` through `lab/step7.html`: cumulative completed stages.
- [Final solution](lab/solution.html): search, keyboard-operable detail buttons, associated form labels/errors, invalid-field focus, image dimensions, below-fold lazy loading and deferred scripts.

Five image elements are present in the actual starter, including the repeated featured photo. All five are addressed. The local images are copies of its Lorem Picsum photographs; the four movie titles are fictional classroom content. Only the featured image is reliably below the fold across desktop widths, so it is lazy; movie thumbnails remain eager.

## Verification

- Mobile Lighthouse, default simulated throttling, one before and one after navigation audit for E1 and for the lab. Reports identify their localhost URLs, browser version, settings and timestamps. Scores are lab observations rather than guaranteed production results.
- The optimized exercise replaces random remote pictures with local sample assets; the lab replaces remote image requests with local copies. These origin/redirect changes contribute to the combined results. Individual optimizations were not benchmarked in isolation.
- Browser checks: title search with Enter, detail buttons with Enter and Space, aria-expanded state, blank-field errors, email-format error, focus on the first invalid input, correction and valid local submission, 390px mobile reflow, E1 deferred status, E3 async/defer status and button, WebP selection at device pixel ratios 1 and 2, and plain JPEG fallback.
- No page errors occurred during those checks. Original starter bytes were compared with the downloaded source and match exactly. Automated accessibility scores alone do not establish full WCAG conformance.
- Run `node scripts/check.mjs` from the repository root to check source links and script syntax. HTML comments are ignored when identifying scripts, allowing the untouched starter's instructional comments to remain intact.
