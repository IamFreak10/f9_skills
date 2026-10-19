---
name: deployment-ops
description: "Use for Ubuntu VPS, Nginx, PM2/systemd, Node hosting, DNS/TLS, cPanel, environment configuration, monitoring, backups, and incidents."
---

# Deploy and operate services with recovery paths


## Purpose and scope
Prepare reliable deployments and operations based on actual hosting capabilities, with health checks and a recovery path.

## Activation conditions
Use for deploys, server setup, production incidents, process restarts, reverse proxy, HTTPS, environment configuration, backups, or hosting limitations.

## Required context
Inspect deployment docs/scripts, OS/runtime versions, hosting plan capabilities, process manager, Nginx config, DNS/TLS state, ports, environment variable names (not values), health endpoints, logs, backup policy, and rollback target.

## Step-by-step workflow
1. Confirm target environment and explicit authorization for production-impacting actions.
2. Verify actual capabilities: SSH, persistent processes, supported Node/PHP versions, database access, custom Nginx, ports, storage, and cPanel app manager availability.
3. Review build/test status and configuration schema; never print secret values.
4. Confirm backup/restore readiness before risky data or filesystem changes.
5. Plan deploy order, migration compatibility, health checks, monitoring, and rollback.
6. Use the existing process manager (PM2 or systemd) and reverse-proxy pattern; do not run duplicate unmanaged daemons.
7. Apply changes incrementally and verify service status, logs, TLS, routes, and health endpoint.
8. Document actual outcome and recovery actions.

## Engineering standards
- Keep secrets in protected environment/configuration stores with restrictive permissions.
- Configure Nginx proxy headers/timeouts/body size deliberately and validate config before reload.
- Use systemd or PM2 according to project conventions; ensure restart policy and log rotation are understood.
- Account for DNS propagation and certificate renewal; HTTPS is not proven by a successful local build.
- Keep app and schema rollout compatible; database rollback may require forward fixes or restore, not merely code rollback.
- On shared hosting/cPanel, confirm support for long-running Node processes, ports, SSH, cron and custom server config before designing deployment.
- Monitor resource use, disk, memory, logs, process restarts, and backup freshness.

## Common anti-patterns
- Assuming root access or custom Nginx on shared hosting.
- Editing production config without a copy/validation/rollback path.
- Exposing `.env`, tokens, database ports, or admin endpoints.
- Restarting or migrating production before checking impact and authorization.
- Treating a backup as valid without a restore test.
- Claiming deployment success from a build alone.

## Security considerations
Use least privilege, firewall only required ports, protect SSH, keep packages patched, restrict secrets/files, and avoid leaking logs. Require explicit authorization before production deploys, restarts, destructive changes, or migrations.

## Verification requirements
Verify config syntax, process status, health endpoint, key user flows, logs, TLS and monitoring where available. State unavailable checks honestly.

## Completion-report format
Report environment/capability assumptions, changes, backup and rollback plan, health checks, actual deployment status, monitoring, and residual risks.

