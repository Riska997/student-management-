# Student Management Platform — Web Demo

An interactive, responsive HTML/CSS/JavaScript adaptation of [Prisca Mulishi's Java Swing + MySQL Student Management Platform](https://github.com/Riska997/StudentManagementPlatform).

## Important distinction

The Java source currently creates a MySQL `Students` table, inserts five sample rows, and opens a largely empty Swing form. This portfolio website **extends** the original concept with a completed student interface; it is not the Java/MySQL backend running on GitHub Pages.

This browser-only demo uses `localStorage`. Records are **not shared between visitors or devices**, and deleting browser data removes any changes. **Do not enter actual students' personal information**, as this is a public demonstration without user authentication or a secure backend.

## Features

- Dashboard with total students, unique modules, lecturers, and flagged records.
- Student register, search, filter by module, edit, delete and clear form.
- Duplicate student-number validation and date validation.
- CSV export and restoration of sample records.
- Responsive layout for mobile and desktop.
- Browser persistence using `localStorage`.

The column `button BOOLEAN` in the original SQL has no explained business meaning. It is presented here as a neutral **Record flag** (Yes/No), not as an inferred enrolment status.

## Sample records

The first visit starts with the five fictional/example records from the Java repository's SQL statement: S001–S005. Use **Restore sample data** to reset this browser's records.

## Run locally

1. Extract this ZIP.
2. Open `index.html` in Chrome or another modern browser. Alternatively open the folder in IntelliJ IDEA and use **Open in Browser**.
3. Test adding, editing, deleting, searching and exporting.

No installation, npm, Java server, or MySQL database is needed for this browser demo.

## Publish free using GitHub Pages

1. Create a **public** repository named `Student-Management-Platform-Web` (or choose another name).
2. Upload `index.html`, `style.css`, and `app.js` into the **repository root**. This README is optional.
3. Go to **Settings → Pages**.
4. Set **Source: Deploy from a branch**, **Branch: main**, and **Folder: /(root)**; save.
5. When published, it should have an address such as `https://riska997.github.io/Student-Management-Platform-Web/` (dependent on the exact repository name).
6. Add that link to the corresponding project entry on your portfolio website.

## Future full-stack upgrade

For multi-user real records, use a backend with authentication, role-based access controls, validation, secure database access, audit logs and privacy protections. A Java Spring Boot API and a hosted database could be used, but those are *not* required for the current demonstration.
