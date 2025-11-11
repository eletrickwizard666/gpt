# ChatGPT 2025 Clone – Design Reference Notes

These notes capture the guardrails used while implementing the high-fidelity workspace clone.

## Tokens

- **Surface base:** `#0b0d12` (dark) / `#f6f7fb` (light)
- **Primary accent:** `#82a0ff`
- **Success:** `#3dd68c`
- **Danger:** `#ff6b6b`
- **Warning:** `#fbbf24`
- **Border radius scale:** 24px / 16px / 10px
- **Font stack:** Inter, system UI fallbacks

## Motion & Micro-interactions

- Shared timing curve `cubic-bezier(0.4, 0, 0.2, 1)` with 160ms durations.
- Token streaming animates in 70ms beats to mimic multi-token bursts.
- Tool cards snap from streaming → complete with gradient highlight.

## Layout Reference

- Sidebar width: 320px (collapses below 960px).
- Main column uses three-row grid: header, transcript, composer.
- Header remains sticky with gradient fade backdrop.

## Accessibility Considerations

- Theme toggle persists to `localStorage` to respect user preferences.
- Button labels use emoji with accessible `aria-label`s where relevant.
- Text contrast validated at AA against both background palettes.

## Follow-up Ideas

- Integrate real workspace switching tray with account avatars.
- Add quick command palette (`⌘K`) and keyboard shortcut hints.
- Wire Playwright visual tests once backend streaming API is available.
