# GPT Frontend Workspace

This repository now includes a modern ChatGPT-style front-end prototype built with Next.js under `frontend/`. The workspace recreates the 2025 ChatGPT UI patterns including sidebar navigation, conversation list, chat transcript with streaming states, tool invocation cards, and a responsive composer.

## Getting Started

### Requirements

- Node.js 18+
- npm 9+ (or pnpm/yarn with equivalent commands)

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Open http://localhost:3000 to view the workspace. The layout supports conversation switching, simulated streaming responses, prompt suggestions, and theme toggling.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Visual Regression Tests

Screenshot baselines live in `frontend/tests/visual/__snapshots__`. Update and run Playwright tests as follows:

```bash
# Terminal 1
npm run dev

# Terminal 2
npx playwright test
# or update snapshots after intentional design changes
npx playwright test --update-snapshots
```

> **Note:** Initial snapshot files are lightweight placeholders. Replace them with real captures once the app is running locally to validate visual fidelity.

## Project Structure

- `frontend/app/` – Next.js App Router entrypoints (`layout.tsx`, `page.tsx`, and global styles).
- `frontend/components/` – Reusable UI components (sidebar, message bubbles, tool cards, composer, settings modal, header controls, theme provider).
- `frontend/store/` – Zustand-powered state management with mock conversation data, streaming simulation helpers, and tool invocation orchestration.
- `frontend/lib/` – Utilities for formatting and seeded mock content.
- `frontend/tests/visual/` – Playwright visual regression suite.
- `frontend/docs/design-reference.md` – Notes on 2025 UI tokens and references.

## Mock Data & State Flows

The workspace bootstraps with curated conversations showcasing:

- Streaming assistant responses with latency telemetry.
- Tool invocation cards that change status and surface outputs.
- Prompt suggestion chips that can trigger new turns.
- Conversation CRUD interactions (create, rename, delete).

Use the **Stream reply** control in the header to demo a full streaming cycle, including automatic tool-card playback and dynamically appended suggestions.
