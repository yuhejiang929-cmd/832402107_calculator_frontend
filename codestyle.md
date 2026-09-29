# Frontend code style

Source: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). The rules below summarize the project conventions; they are not a copy of the guide.

- Two-space indentation; ES modules; `const` by default and `let` for reassignment.
- camelCase functions/variables; UPPER_SNAKE_CASE fixed configuration constants; descriptive DOM references.
- Single quotes in JavaScript; semicolons; Prettier provides consistent wrapping.
- async/await for network flows, try/catch/finally for errors and loading state restoration.
- Modules separate API transport, text editing, history, theme and keyboard behavior.
- No arithmetic evaluation in the frontend; no dynamic code execution.
- Semantic HTML, associated labels, accessible button names, visible focus styles and live result/error regions.
- Kebab-case CSS classes, CSS variables for themes and responsive media queries.
- Construct dynamic content with createElement/textContent, never interpolate untrusted HTML.
- Comments explain non-obvious decisions such as request invalidation; avoid narrating obvious syntax.
- Tests assert observable text transformations; browser acceptance covers API integration and user flows.

```bash
npm run format
npm run format:check
npm test
npm run build
```
