# Shared spider animation

Added 31 October 2026 at the owner's request, inspired by the hanging cursor-following spider and web behaviour in https://www.instagram.com/reel/DfHyZQoIH_U/ . This is an original Canvas illustration and animation; it uses no copied reel media or external dependencies.

`assets/js/spider.js` draws a patterned orb-weaver with articulated, banded legs, a damped cursor chase, hanging silk, bounded trails, and slowly drawn spiral webs. Silk and control colours adapt to light and dark page backgrounds. Pointer events pass through the decorative canvas. Touch devices use a gentle hanging animation instead of capturing gestures. Reduced-motion preferences disable it. The existing homepage Pause motion button also pauses it; Hide spider persists across pages.

One relative deferred script include is added to each of 126 actual content pages. The 112 compatibility redirects stay unchanged. Existing links, lesson code, styles, and form content are preserved. No animation state is transmitted to a server.

Verification: repository checker reports 238 HTML pages and 155 JavaScript sources with zero errors. All 20 existing text-reveal, API example and game-engine tests pass. Original HTML comparison confirms that removing the added include restores the previous content exactly after normalizing line endings. Browser checks cover the homepage search, existing pause/resume, a working DOM lesson, light/dark colour changes, transparent pointer handling, narrow-screen width, and console errors.

To disable or revise the feature globally, edit this one shared script. Removing each `data-sudip-spider` script tag fully removes the integration. Revert the feature commit to restore the previous repository state.
