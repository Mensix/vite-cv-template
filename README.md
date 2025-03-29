# Vite CV Template with PDF Export

This is a Vite-based template for creating a CV in HTML and exporting it to a PDF.
It uses Tailwind CSS for styling and Playwright for PDF generation.

## Features

*   **Tailwind CSS:** Style your CV using utility classes.
*   **A4 Pages:** Automatically applies A4 dimensions to your page divs (`<div id="page1">`, `<div id="page2">`, etc.).
*   **PDF Export:** Generates a PDF version of your CV via a download button.
*   **Vite Dev Server:** Fast development experience with HMR.

## Setup

**Prerequisites:**

*   Node.js (16+ recommended) or Bun
*   A compatible browser for Playwright (Chromium will be installed)

**Steps:**

1.  **Clone:** `git clone <repository-url> cv-template && cd cv-template`
2.  **Install Deps:**
    *   `npm install` (or `yarn install`, `pnpm install`)
    *   OR `bun install`
3.  **Install Browser:**
    *   `npx playwright install chromium`
    *   OR `bunx playwright install chromium`

## Development

Run the development server:

*   `npm run dev`
*   OR `bun run dev`

Open `http://localhost:5173` (or the specified port) in your browser.

## How It Works

1.  **`index.html`:** This is the main file where you write your CV content.
2.  **`src/style.css`:** Contains Tailwind directives and custom CSS.
3.  **`src/main.ts`:**
    *   Adds the `.page-a4` class to all `<div id="pageX">` elements.
    *   Injects the PDF download button.
4.  **`vite.config.ts`:**
    *   Configures Vite and Tailwind.
    *   Includes a custom plugin that handles requests to `/generate-pdf`.
    *   Uses Playwright to:
        *   Launch a headless browser.
        *   Navigate to your running dev server URL.
        *   Wait for fonts and rendering (`networkidle`, `document.fonts.ready`).
        *   Inject CSS for print layout (hiding the button, setting page breaks).
        *   Generate the PDF.

## Usage Guide

*   **Edit `index.html`:** Add your CV content within `<div id="page1">`, `<div id="page2">`, etc.
*   **Styling:** Use Tailwind classes directly in the HTML. You can add custom CSS to `src/style.css`.
*   **PDF Download:** Click the floating button in the bottom-right corner to download the PDF.

### HTML Structure Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My CV</title>
    <link rel="stylesheet" href="/src/style.css">
    <script type="module" src="/src/main.ts"></script>
</head>
<body>
    <div id="page1">
        <!-- Content for the first page -->
        <h1 class="text-2xl font-bold">Your Name</h1>
        <!-- ... more content ... -->
    </div>
    <div id="page2">
        <!-- Content for the second page -->
        <h2 class="text-xl font-semibold">Experience</h2>
        <!-- ... more content ... -->
    </div>
    <!-- Add more <div id="pageX"> as needed -->
</body>
</html>
```

**Notes:**

*   The `.page-a4` class is automatically added by `src/main.ts`.
*   The download button is also automatically added.
*   The PDF generation uses the styles active in the browser, including Tailwind.

## Customization

*   **Styles:** Modify `tailwind.config.js` or add styles to `src/style.css`.
*   **PDF Options:** Adjust Playwright settings in `vite.config.ts` within the `pdfGeneratorPlugin` function (e.g., margins, format).
*   **Button:** Change the appearance or position of the injected button in `src/main.ts`.

## License

MIT
