# Windows EXE Product Landing Page

A production-ready React landing page template for showcasing and distributing a downloadable Windows `.exe` software product.

The template is built with Vite, React, TypeScript, Tailwind CSS, and `lucide-react` icons. It includes a hero section, product preview, feature grid, download panel, changelog, security notes, and footer.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```txt
.
├── public/
│   ├── downloads/
│   │   └── README.md
│   └── screenshots/
│       └── README.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Customizing The Product

Most product metadata is defined near the top of `src/App.tsx`:

```ts
const product = {
  name: 'MyApp',
  version: 'v2.4.1',
  fileSize: '86 MB',
  windowsSupport: 'Windows 10 and 11',
  installerPath: '/downloads/MyAppSetup.exe',
  checksum: 'SHA-256 checksum placeholder',
  releaseDate: 'April 2026',
};
```

Update these values before publishing:

- Product name
- Latest version
- File size
- Windows support text
- Installer path
- SHA-256 checksum
- Release date

## Local Copy Editing

When the site is opened on `localhost`, `127.0.0.1`, or `0.0.0.0`, a small editor toolbar appears at the bottom of the page.

Use it to:

- Toggle editable page copy
- Click text directly on the page and change it
- Drag and drop a Windows `.exe` installer onto the developer upload area
- Save the dropped installer into `public/downloads`
- Measure the installer size and show it in the page metadata
- Save copy changes automatically in browser `localStorage`
- Reset local edits back to the default copy

The editor toolbar is guarded by the browser hostname. It does not appear on a normal deployed domain, so public visitors cannot edit the website.

Important: this local editor is for previewing copy in the browser. To make edits permanent in the codebase, update the matching values in `defaultCopy` inside `src/App.tsx`.

The installer uploader only works while running the Vite dev server. It posts to the local-only `/__dev/upload-exe` middleware in `vite.config.ts`, which writes the file to `public/downloads`. Static production deployments do not include this upload endpoint.

## Download File

Place the Windows installer here:

```txt
public/downloads/MyAppSetup.exe
```

The app references it with:

```txt
/downloads/MyAppSetup.exe
```

In local developer edit mode, dropping a different `.exe` updates the active download link and measured file size in the browser. For a production release, commit or copy the intended installer into `public/downloads` and update the default product metadata in `src/App.tsx` if needed.

## Screenshots

Place the main product screenshot here:

```txt
public/screenshots/main-preview.png
```

Static files in `public` are served from the site root, so reference this image as:

```txt
/screenshots/main-preview.png
```

The current page uses a CSS desktop mockup. You can replace or extend the preview section in `src/App.tsx` to use your real screenshot.

## Security Notes

For a real software distribution page, publish:

- Code-signing details
- SHA-256 checksum for the installer
- Version number and release date
- Changelog for each release
- Support or vulnerability contact

## Deployment

Run:

```bash
npm run build
```

Then deploy the generated `dist` folder to any static host, such as Vercel, Netlify, GitHub Pages, Cloudflare Pages, or an object storage bucket with static website hosting.
