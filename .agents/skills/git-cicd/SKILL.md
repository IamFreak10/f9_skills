---
name: git-cicd
description: "Use for branch/diff operations, GitHub Actions, pull requests, dependency caching, permissions, release pipelines, and rollback planning."
---

# Use safe Git and reproducible CI/CD workflows


## Purpose and scope
Keep source history safe and automate repeatable checks with least-privilege CI.

## Activation conditions
Use for Git workflows, PR preparation, workflow YAML changes, release pipelines, build artifacts, and CI failures.

## Required context
Inspect Git status/diff, branch/upstream, repository contribution rules, existing `.github/workflows`, lockfiles, secret conventions, and branch protection/release model if known.

## Step-by-step workflow
1. Check branch, working tree, staged/unstaged/untracked changes, and upstream state.
2. Preserve all user modifications; do not reset, clean, stash, or rewrite history casually.
3. Make scoped changes and inspect `git diff --check` plus the full diff.
4. For Actions, pin third-party actions to trusted immutable references where policy supports it, scope `permissions`, and use protected environments for production secrets.
5. Keep dependency installation/build reproducible with lockfiles and appropriate cache keys.
6. Validate workflow triggers, conditions, artifact provenance, and deployment gates.
7. Run relevant local checks and report which CI checks remain pending.

## Engineering standards
- Never force-push, amend shared history, reset user work, or delete branches without explicit authorization.
- Avoid exposing secrets in command arguments/logs; use platform secret stores and least privilege.
- Avoid broad `write-all` permissions; grant only needed token scopes.
- Separate untrusted PR validation from privileged deployment credentials.
- Prefer immutable, verifiable build artifacts and explicit release versions.
- Keep CI fast enough to be useful without removing critical gates.

## Common anti-patterns
- Blind `git add .` or committing unrelated files.
- Using untrusted PR code with production secrets.
- Unpinned or unreviewed third-party actions without risk assessment.
- Caching credentials or mutable artifacts as trusted outputs.
- Reporting local success as proof remote CI or deployment passed.

## Security considerations
Review workflow injection risks, fork behavior, secret exposure, token permissions, dependency compromise, and artifact integrity. Treat branch names and PR metadata as untrusted strings.

## Verification requirements
Run whitespace/diff checks, workflow syntax validation if installed, and relevant test/build commands. Do not claim GitHub Actions ran unless observed.

## Completion-report format
Report branch/worktree context, files changed, workflow permissions/triggers, local checks, pending remote gates, and any history or release actions intentionally not taken.

