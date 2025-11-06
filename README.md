## Bokata Miro

**&nbsp;ℹ&nbsp;Note**:

- We recommend a Chromium-based web browser for local development with HTTP. \
  Safari enforces HTTPS; therefore, it doesn't allow localhost through HTTP.
- For more information, visit our [developer documentation](https://developers.miro.com).

### How to start locally

- Run `npm i` to install dependencies.
- Run `npm start` to start developing. \
  Your URL should be similar to this example:
 ```
 http://localhost:3000
 ```
- Paste the URL under **App URL** in your
  [app settings](https://developers.miro.com/docs/build-your-first-hello-world-app#step-3-configure-your-app-in-miro).
- Open a board; you should see your app in the app toolbar or in the **Apps**
  panel.

### How to build the app

- Run `npm run build`. \
  This generates a static output inside [`dist/`](./dist), which you can host on a static hosting
  service.

### Testing

The project includes a comprehensive test suite with **64 passing tests** covering all Walking Skeleton increments.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Validation service (10 tests)
- ✅ Markdown parser (18 tests)
- ✅ Sticky formatter (11 tests)
- ✅ Layout engine (14 tests)
- ✅ Integration tests (11 tests)

See [TEST_COVERAGE.md](./TEST_COVERAGE.md) for detailed test documentation.

### Folder structure

```
.
├── src
│  ├── assets
│  │  └── style.css
│  ├── components
│  │  └── BreakdownForm.tsx    // Main form component (UI)
│  ├── services
│  │  ├── validation.ts         // Markdown validation logic
│  │  ├── markdownParser.ts     // Parse markdown tables
│  │  ├── stickyFormatter.ts    // Format sticky note content
│  │  ├── layoutEngine.ts       // Grid layout calculations
│  │  └── miroAPI.ts            // Miro SDK integration
│  ├── types
│  │  └── index.ts              // TypeScript type definitions
│  ├── app.tsx                  // Main app component
│  └── index.ts                 // App entry point
├── docs
│  └── plan.md                  // Walking Skeleton development plan
├── app.html                    // The app panel HTML
├── index.html                  // The app entry point
└── example-markdown.md         // Example markdown for testing
```

### About the app

**Miro Feature Breakdown Visualizer** - A Miro plugin that transforms markdown feature breakdowns into visual sticky note layouts on your board.

#### Features

- **Markdown Input**: Paste your feature breakdown in markdown format with pipe-delimited tables
- **Automatic Parsing**: Extracts steps and increments from your markdown
- **Grid Layout**: Automatically positions sticky notes in an organized grid
- **Visual Breakdown**: Creates one sticky note per increment with ID and title
- **Zoom to Fit**: Automatically zooms to show all created stickies

#### How to Use

1. Open the app in your Miro board (click the app icon in the toolbar)
2. Paste your markdown feature breakdown into the textarea
3. The app validates your markdown in real-time
4. Click "Create Breakdown" to generate sticky notes
5. View your visualized breakdown on the board!

#### Markdown Format

Your markdown should include:

1. A **Steps Overview Table** with columns: #, Step ID, Name, Layer
2. Multiple **Step sections** with increment tables

Example:

```markdown
## Steps Overview

| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |

## Step 1.1: Sidebar Text Input

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 |
```

See `example-markdown.md` for a complete example.

Built using [`create-miro-app`](https://www.npmjs.com/package/create-miro-app).

This app uses [Vite](https://vitejs.dev/). \
If you want to modify the `vite.config.js` configuration, see the [Vite documentation](https://vitejs.dev/guide/).
