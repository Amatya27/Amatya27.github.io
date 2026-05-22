# Amatya Katyayan Portfolio

This repository contains my personal portfolio website. It highlights my work in robotics, AI, computer vision, research, and software engineering, and it is built as a lightweight static site for GitHub Pages.

## Overview

- Single-page homepage with sections for About, Projects, Skills, Experience, Research, Achievements, and Contact
- Supporting pages for coding highlights, research, smart agriculture, and activity highlights
- Static frontend with no build step and no backend

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Pages

## Project structure

- `index.html` - main portfolio homepage
- `generic.html` - coding competition highlights
- `elements.html` - research page
- `fyp.html` - smart agriculture project page
- `profile.html` - achievements and activity highlights
- `thanks.html` - contact form confirmation page
- `assets/css/styles.css` - shared styles and responsive layout
- `assets/js/site.js` - shared interactions and page behavior
- `assets/resume/Amatya_Katyayan_Resume.pdf` - resume file used by the resume request flow
- `images/` - project, research, and activity assets

## Run locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploy to GitHub Pages

This site is designed to run directly from the repository root on GitHub Pages.

1. Push the latest changes to the branch used for GitHub Pages.
2. In the repository settings, confirm that Pages is serving from the repository root.
3. No build command is required.

## Updating content

1. Edit the main homepage sections in `index.html`.
2. Update supporting detail pages in `generic.html`, `elements.html`, `fyp.html`, and `profile.html`.
3. Replace or add images in `images/` and keep the existing card/layout patterns for consistency.
4. Replace `assets/resume/Amatya_Katyayan_Resume.pdf` when updating the resume.
5. If a new page is added, include it in `sitemap.xml` and use the shared CSS and JavaScript files.

## Notes

- Keep external links using `target="_blank"` and `rel="noopener noreferrer"`.
- The contact and resume request flow is set up to stay compatible with GitHub Pages.
