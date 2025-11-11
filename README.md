# GPT Frontend Workspace

This repository now includes a modern ChatGPT-style front-end prototype built with Next.js under `frontend/` alongside an Express-based API in `backend/`. The workspace recreates the 2025 ChatGPT UI patterns including sidebar navigation, conversation list, chat transcript with streaming states, tool invocation cards, and a responsive composer while the API exposes conversation, message, and streaming endpoints.

## Getting Started

### Requirements

- Node.js 18+
- npm 9+ (or pnpm/yarn with equivalent commands)

### Installation (Frontend)

```bash
cd frontend
npm install
```

### Development Server (Frontend)

```bash
npm run dev
```

Open http://localhost:3000 to view the workspace. The layout supports conversation switching, simulated streaming responses, prompt suggestions, and theme toggling.

### Production Build (Frontend)

```bash
npm run build
npm start
```

### Linting (Frontend)

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

## Backend API

The `backend/` directory contains a typed Express server that seeds the same conversation data used by the front-end mock state. It exposes REST + SSE endpoints for listing conversations, appending messages, and simulating assistant streaming.

### Installation (Backend)

```bash
cd backend
npm install
```

### Development Server (Backend)

```bash
npm run dev
```

The API defaults to `http://localhost:4000` and provides:

- `GET /api/health` – uptime check.
- `GET /api/conversations` – conversation summaries.
- `POST /api/conversations` – create a new conversation.
- `GET /api/conversations/:id` – fetch full conversation details.
- `POST /api/conversations/:id/messages` – append a user/assistant/tool message.
- `GET /api/conversations/:id/stream` – server-sent events stream that simulates an assistant reply.

### Production Build (Backend)

```bash
npm run build
npm start
```

### Quality Gates (Backend)

```bash
npm run lint
npm test
```

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
