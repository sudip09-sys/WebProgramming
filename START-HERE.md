# Open your Web Studio in VS Code

1. Extract the ZIP completely; do not edit files inside the ZIP viewer.
2. In VS Code, choose **File → Open Folder** and select the extracted **WebProgramming** folder. You can also open **WebProgramming.code-workspace**.
3. Open the terminal in VS Code and run `node scripts/serve.mjs`. This requires Node.js 18 or newer.
4. Open **http://127.0.0.1:4173** in your browser. Stop the server with **Ctrl+C**.

Alternatively, install the recommended **Live Server** extension, right-click **index.html**, and choose **Open with Live Server**.

## Where to edit

- Homepage layout: `index.html`
- Shared design: `assets/css/studio.css`
- Homepage search and filters: `assets/js/home.js`
- Creative prompts and saved ideas: `assets/js/idea-mixer.js`
- Course navigation data: `assets/js/course-data.js`
- Book search: `assets/js/books.js`
- Exercises: `coursework/` and the original `Week*/` folders

After editing, run `node scripts/check.mjs` to check links and JavaScript syntax. The ZIP includes the source and project files, with no Git history, credentials, or installed dependencies. API demonstrations need internet access. Saved sparks and favourites are stored by the browser and are not part of the ZIP.
