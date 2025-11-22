## Goal
- Keep Codexia as a thin local UI wrapper around Codex CLI only. No hosted access, no extra accounts, no MCP/additional services. Serve UI locally for a PySide6 webview at `localhost:7420`.

## Scope
- Local-only web server (no 0.0.0.0 exposure). Fixed loopback host/port for PySide6.
- Only Codex core features: chat/turns, file ops/patch approvals, basic settings for Codex path/client selection.
- Remove/ignore auxiliary UX (login screens, usage analytics, MCP, agent builder, auth flows, remote sharing).

## Tasks (short term)
- [ ] Gate or hide UI/routes tied to login/auth, usage analytics, MCP, agent builder, multi-provider config.
- [ ] Verify remote UI auto-start binds to loopback only and advertises `localhost:7420`.
- [ ] Update docs to reflect local-only usage and pared-down feature set.
- [ ] Smoke test: start Tauri, ensure PySide6/web browser at `http://localhost:7420` can chat with Codex and perform file/patch approvals without other prompts.
