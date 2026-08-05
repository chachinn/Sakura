# Sakura

A plain HTML, CSS, and JavaScript mobile Japanese-learning application that can be installed as a Progressive Web App (PWA). No framework or build step is required.

The app includes independent JLPT filters, editable kanji and vocabulary collections, three quizzes, Native Japanese and Current Slang cards, detail screens, saved items, and persistent flashcard study statuses.

The clean sakura-pastel interface includes five selectable color themes. You can optionally choose a private device photo as a wallpaper; Sakura resizes it and stores it locally in IndexedDB rather than uploading it or putting it in localStorage.

## Run locally

A service worker does not work when `index.html` is opened directly from the file system. Serve the folder through a local web server instead.

1. Open PowerShell in this project folder.
2. Run one of these commands:

   ```powershell
   py -m http.server 8000
   ```

   or:

   ```powershell
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in a browser.

The external Japanese-learning APIs require an internet connection. The app shell and Kanji API responses that have already been requested are cached for practical offline use. Built-in fallback words, kanji, and related phrase suggestions remain available offline.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload every project file and folder to it.
2. On the repository page, open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the project (usually `main`) and the `/ (root)` folder, then save.
5. After GitHub finishes publishing, open the HTTPS address shown on the Pages screen.

The project uses relative paths, so it works whether GitHub Pages publishes it at a user site or under a repository subfolder.

## Install on an iPhone

1. Deploy the app to an HTTPS website such as GitHub Pages.
2. Open the deployed address in **Safari** on the iPhone.
3. Tap Safari's **Share** button.
4. Scroll down and tap **Add to Home Screen**.
5. Confirm the name, then tap **Add**.

Open the new Sakura icon from the Home Screen to use the dashboard in standalone mode. Safari may need to load the site online once before its offline cache is available.

## Update the app

1. Edit `index.html`, `style.css`, or `app.js` as usual.
2. When changing cached files, update `CACHE_VERSION` near the top of `service-worker.js` (for example, change `sakura-dashboard-v1` to `sakura-dashboard-v2`).
3. Upload or push the changed files to the GitHub Pages branch.
4. Reopen the installed app while online. Safari will download the new service worker and cached files; fully closing and reopening the app may help the update appear immediately.

When changing a cached file, update both its query string in `index.html` / `service-worker.js` and the service-worker cache version. Device wallpapers do not belong in the project: users choose them from Appearance, and Sakura stores the compressed image in the `sakuraAppearanceDB` IndexedDB database.

## English to Japanese

The English-to-Japanese screen works offline by suggesting related phrases already included in Sakura. It is also ready to call a secure server-side translator. Set `TRANSLATION_API_ENDPOINT` near the top of `app.js` to your deployed endpoint (for example, `/api/translate`). Never place a private AI or translation API key in this project or any browser-visible storage. The endpoint must accept the documented `english`, `context`, and `tone` JSON fields and return the structured translation fields used by the result card.

## Edit learning content

Learning content is kept separate from application logic in the `data` folder:

- `data/kanji.js` — kanji, readings, JLPT levels, example vocabulary, and sentences
- `data/vocabulary.js` — vocabulary from N5 through N1
- `data/native-japanese.js` — natural expressions and conversations
- `data/slang.js` — current casual, internet, youth, gaming, and gyaru language

Each file starts with a beginner editing guide. Copy an existing object, give it a unique `id`, and change its fields. New data files must also be added to `APP_SHELL` in `service-worker.js`; existing files are already cached.

## Data storage

Sakura uses `localStorage` for on-device preferences, themes, JLPT selections, saved items, translation history, Native Japanese difficulty, and Known/Needs Review flashcard statuses. The selected wallpaper image is stored separately in IndexedDB. This data stays on that browser/device and does not require an account. Removing Safari website data or uninstalling the Home Screen app may remove it.
