# AGENTS.md

Guidance for coding agents working on this repository.

## App Overview

This is a Vite + React + TypeScript + Tailwind CSS landing page for distributing a downloadable Windows `.exe` product.

Primary files:

- `src/App.tsx`: Main page content, product metadata, sections, and components.
- `src/styles.css`: Tailwind imports and shared component utility classes.
- `public/downloads/`: Static installer files.
- `public/screenshots/`: Static product screenshots.

## Development Commands

Use these commands from the repository root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Always run `npm run build` after changing TypeScript, React, Tailwind classes, or config files.

## Implementation Guidelines

- Keep the page component-based and easy to customize.
- Prefer editing existing components in `src/App.tsx` unless the page grows large enough to justify splitting sections into separate files.
- Keep product metadata centralized in the `product` object near the top of `src/App.tsx`.
- Keep editable landing-page copy centralized in `defaultCopy` near the top of `src/App.tsx`.
- Use Tailwind utility classes and the shared CSS classes in `src/styles.css`.
- Use `lucide-react` icons for UI actions and feature cards.
- Keep the design mobile-first and responsive.
- Avoid introducing a heavy UI framework unless explicitly requested.
- Do not hardcode local filesystem paths into browser-facing code.

## Local Edit Mode

The app includes a localhost-only copy editor:

- `EditorToolbar` only renders for `localhost`, `127.0.0.1`, or `0.0.0.0`.
- Editable fields use `EditableText`.
- Local browser edits are saved in `localStorage` under `myapp-landing-copy`.
- Installer metadata is saved in `localStorage` under `myapp-installer-meta`.
- Dragging a `.exe` onto the toolbar in edit mode uploads it to the Vite dev middleware at `/__dev/upload-exe`.
- The upload middleware is defined in `vite.config.ts` and writes installers to `public/downloads`.
- Deployed domains should never expose the toolbar or content-editable state.

Do not remove the hostname guard unless the user explicitly asks for a public CMS/editor.
Do not add a production upload endpoint unless the user explicitly asks for a backend with authentication and storage.

## Product Distribution Notes

The download CTA currently points to:

```txt
/downloads/MyAppSetup.exe
```

For production, make sure the actual installer exists at:

```txt
public/downloads/MyAppSetup.exe
```

Security and trust content should be updated before launch:

- Real SHA-256 checksum
- Code-signing publisher name
- Release date
- Changelog
- Support contact

## Styling Notes

- The current visual style is clean, restrained, and product-focused.
- Avoid oversized marketing-only sections that hide the download path.
- Keep buttons, metadata, changelog, and security details easy to scan.
- Use semantic section IDs for navigation anchors.

## Verification Checklist

Before handing off changes:

- `npm run build` passes.
- The download link still resolves to the configured installer path.
- Navigation anchors still match section IDs.
- Mobile layouts do not overflow.
- Local edit mode appears on localhost and remains hidden on normal deployed hostnames.
- Local `.exe` upload works when the Vite dev server is running.
- Placeholder product details are replaced when preparing a real release.
