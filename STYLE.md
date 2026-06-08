# Code Style Guide - EpochSend Frontend

## JavaScript / TypeScript

- **Formatting:** Use Prettier with standard config.
- **Linting:** ESLint with recommended rules.
- **Components:** Functional components with typed props.
- **State:** Use React Hooks (`useState`, `useEffect`, `useContext`).
- **Styling:** Tailwind CSS utility classes.
- **Async:** Use async/await, handle errors properly with try/catch blocks.
- **Types:** Always define strict interfaces or types for data structures and component props.

## Project Conventions

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utils: `camelCase.ts`
- Types: `PascalCase.ts`

### Git Commits
- Follow modular commit philosophy.
- Commit after meaningful changes.
- Run build before committing.

## Integrity Checks

- **Frontend:** `npm run build` should successfully compile before pushing any code.
- **Typecheck:** `npm run typecheck` if available.

---

*Always ensure the UI is fully responsive and compiles correctly.*
