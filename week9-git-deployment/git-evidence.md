# Local Git exercise evidence

Executed 4 November 2026 in the task workspace, not on the student's personal computer.

```sh
mkdir my-first-git
cd my-first-git
git init -b main
# Create index.html containing Hello Git, name and date
git status --short
# ?? index.html
git add index.html
git commit -m "Initial commit: add index.html"
# 7d0f876
git checkout -b feature-style
# Create style.css: body { font-family: sans-serif; }
git add style.css
git commit -m "Add basic stylesheet"
# 4527fb0
git checkout main
git ls-files
# index.html (style.css is absent)
git merge feature-style
# Fast-forward; style.css added
git log --oneline --all --graph
# * 4527fb0 Add basic stylesheet
# * 7d0f876 Initial commit: add index.html
git status --short
# Clean
```

E1 and E2 were executed. E3's push to a separate git-exercise repository has NOT been executed. Publishing this evidence file through the GitHub API is not a git push and does not preserve the local commit graph online.
