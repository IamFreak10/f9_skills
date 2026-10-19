# Deployment Checklist

## Environment prerequisites
- [ ] Target environment and release identified; production action explicitly authorized.
- [ ] Runtime, OS, hosting plan, process manager, storage and port capabilities confirmed.
- [ ] DNS, TLS, proxy and firewall ownership/access confirmed.
- [ ] Current Git revision and artifact provenance recorded.

## Required configuration
- [ ] Required environment variable names/schema validated without printing secret values.
- [ ] Correct API origins, OAuth callback URLs, CORS and cookie settings confirmed.
- [ ] File permissions and service identity use least privilege.
- [ ] Health/readiness endpoints and expected responses known.

## Secrets verification
- [ ] Secrets are in an approved secret store/environment configuration.
- [ ] No secrets in Git, artifacts, command history, logs, or client bundle.
- [ ] Rotation/revocation plan exists for any exposed credential.

## Backup requirements
- [ ] Database and required files backed up before risky changes.
- [ ] Backup freshness and integrity checked.
- [ ] Restore procedure and owner identified.
- [ ] Data-loss risk documented.

## Build and test steps
- [ ] Dependencies installed reproducibly from lockfile.
- [ ] Lint/typecheck/tests/build executed; actual results recorded.
- [ ] Artifact/version verified and staged config reviewed.
- [ ] Diff and migration SQL reviewed.

## Migration plan
- [ ] Migration compatibility and lock/downtime assessed.
- [ ] Expand/backfill/switch/contract plan considered where needed.
- [ ] Rollback/recovery limitations documented.
- [ ] Production migration explicitly approved before execution.

## Deployment steps
- [ ] Deployment order and maintenance/traffic strategy confirmed.
- [ ] Existing process manager (PM2/systemd/platform manager) identified.
- [ ] Nginx/proxy config validated before reload.
- [ ] Rollout and rollback owner/contact identified.

## Health checks
- [ ] Process/service status healthy.
- [ ] Health endpoint responds as expected.
- [ ] TLS certificate and critical routes verified.
- [ ] Login/authenticated and key business flows smoke-tested.
- [ ] Logs contain no new errors or secret leakage.

## Monitoring
- [ ] Error rate, latency, resource use, restarts, disk and database health observed.
- [ ] Alerts and log access available.
- [ ] Backup/renewal schedules remain active.

## Rollback procedure
- [ ] Known-good artifact/revision identified.
- [ ] Rollback commands/steps reviewed but not run prematurely.
- [ ] Schema/data rollback constraints understood; restore or forward-fix plan ready.
- [ ] Post-rollback health checks defined.
- [ ] Final outcome, revision, checks and residual risks recorded.
