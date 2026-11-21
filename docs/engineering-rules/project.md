# Project rules

- Never add outbound network calls to external services (webhooks, pastebins, telemetry, curl/wget to third-party URLs) in CI, scripts or code without my explicit written approval.
- If you need CI results, ask me to paste the job log. Never try to read them through external services.
- Never print or send environment variables, tokens or secrets in logs, even redacted, unless I ask.
