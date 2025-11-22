# Codexia (local-only UI for Codex CLI)

Lightweight Tauri/React UI that wraps Codex CLI locally. No hosted services, no extra login. Remote UI auto-starts on loopback so you can open it in a browser or embed it in a PySide6 webview.

## Defaults
- Remote UI binds to `http://localhost:7420` on loopback only.
- Native window stays minimized; use the webview instead.
- Only Codex CLI features are expected (chat/turns, file ops, apply/exec approvals). Auxiliary modules like analytics, MCP, multi-provider auth are out of scope.

## Prerequisites
- Codex CLI installed (e.g., `npm i -g @openai/codex@0.63.0`), `codex --version` should show 0.63.0.
- Rust toolchain, Bun.

## Quick start (local webview)
```bash
# install deps if needed
bun install

# regenerate bindings and build static assets
bun run export:bindings
bun run build

# launch tauri (auto-starts Remote UI)
bun tauri dev
```

Then open `http://localhost:7420` in your browser or point your PySide6 `QWebEngineView` at that URL.

## Usage
- Chat/turns run through your local Codex CLI.
- File viewing/editing and apply/exec approvals are available; everything stays on your machine.
- No account login, analytics dashboard, MCP server manager, or multi-provider setup is included in this trimmed mode.

## Notes
- If you change the loopback alias or port, update the Remote UI config in code to match your PySide6 target.
- Keep Codex CLI updated separately; this UI assumes the CLI is present and accessible on PATH.
