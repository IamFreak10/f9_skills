# AI Developer Skills Ecosystem

A portable, repository-first engineering playbook for coding agents. It combines concise global instructions, 14 selectively loaded skills, copy-ready templates, and a dependency-free validator.

## What this is (and is not)

- **Instructions** (`AGENTS.md`, `CLAUDE.md`) establish workflow and safety expectations.
- **Skills** (`.agents/skills/*/SKILL.md`) provide task-specific procedures that an agent can load selectively.
- **Templates** standardize plans, reviews, and deployment readiness.
- **Validator** checks the canonical skill files and their basic structure.
- This is not an autonomous multi-agent framework, MCP server, executable deployment system, or guarantee that a host agent discovers these files automatically.

## Quick start (GitHub CLI Installation)

Install this ecosystem directly into any project using a single command without publishing to npm:

```bash
# Install canonical .agents/skills/ + AGENTS.md + templates/ into current project:
npx -y github:IamFreak10/f9_skills init

# Or install native Claude Code format (.claude/skills/ + CLAUDE.md):
npx -y github:IamFreak10/f9_skills init --claude

# Or install both formats:
npx -y github:IamFreak10/f9_skills init --all

# Dry-run preview (simulates installation without writing to disk):
npx -y github:IamFreak10/f9_skills init --dry-run
```

> **Note on `npx` syntax:** In modern npm (v7+), `-y` (or `--yes`) automatically confirms the package installation prompt, making commands frictionless and CI-friendly. You can also run `npx github:IamFreak10/f9_skills init` in interactive terminals.

### CLI Commands and Options

| Command / Flag | Purpose |
|---|---|
| `npx -y github:IamFreak10/f9_skills init` | Install skills into `.agents/skills/`, copy `templates/` and `AGENTS.md` |
| `--claude` | Install native Claude Code layout (`.claude/skills/` and `CLAUDE.md`) |
| `--all` / `--both` | Install both `.agents/skills/` and `.claude/skills/` layouts |
| `--target <dir>` / `-t <dir>` | Specify destination directory (defaults to current working directory) |
| `--skills <list>` | Install only specific skills (e.g. `--skills auth-security,debugging`) |
| `--dry-run` / `-d` | Preview changes without modifying files or creating directories |
| `--force` / `-f` | Overwrite existing files that have differing content |
| `--no-templates` | Skip installing the `templates/` directory |
| `--no-rules` | Skip copying `AGENTS.md` / `CLAUDE.md` |
| `npx -y github:IamFreak10/f9_skills list` | List all 14 available skills and descriptions |
| `npx -y github:IamFreak10/f9_skills --help` | Display full help documentation |

### Safety and Idempotence
- **Idempotent:** Re-running `init` on an existing installation detects identical files and safely reports them as unchanged without re-writing.
- **Conflict-safe:** If an existing file has user-modified content, the installer **never silently overwrites** it. It skips the file, flags a conflict, and preserves user changes. Pass `--force` only if you explicitly want to overwrite.

### Manual / Local Usage
1. Clone or copy this directory into or alongside a project where you want to use it.
2. Validate the ecosystem:
   ```bash
   python3 scripts/validate-skills.py
   # Or run automated tests:
   npm test
   ```
3. Ask your coding agent to inspect the repository, select relevant skills from the routing matrix, and follow **Understand → Inspect → Plan → Implement → Verify → Review → Report**.

Skills are modular guidance, not a checklist: normally load one primary skill and only the supporting skills needed for the current task. This keeps context focused while preserving specialist instructions for security, data, testing, UI, and operations.

## Canonical source and agent compatibility

`.agents/skills/` is the **single source of truth**. No duplicated `.claude/skills/` tree is generated, avoiding drift and conflicting copies.

The current package was assembled in a restricted ChatGPT-provided container, not inside a detected Claude Code, Cursor, VS Code, or other IDE-agent workspace. No host-agent binary or project repository was available for compatibility probing. Consequently, native discovery in a target environment is **not verified**.

For Claude Code, the usual native layout is `.claude/skills/<skill-name>/SKILL.md` (project scope) or `~/.claude/skills/<skill-name>/SKILL.md` (personal scope). To integrate, copy canonical skills to the project's `.claude/skills/` directory or create symlinks where supported, then verify discovery in the installed Claude Code version. If integrating into an existing project, inspect its Git status and instructions first; do not overwrite user files. Keep `.agents/skills/` canonical and document any adapter/sync process you choose.

For agents supporting `AGENTS.md` and `.agents/skills/`, verify the specific product's documented skill discovery and frontmatter requirements before relying on automatic invocation. Frontmatter compatibility is not universal.

## Skill routing matrix

| Task type | Primary skill | Supporting skills | Required verification | Approval boundary |
|---|---|---|---|---|
| New feature or cross-cutting change | `feature-planner` | Relevant frontend/backend, `state-management`, `testing-quality-gates` | Acceptance criteria, targeted tests, diff review | Ask only for blocking ambiguity or consequential action |
| Type errors or type-safe refactor | `typescript-engineering` | `debugging`, relevant framework, testing | Type check and regression tests | No approval for routine local edits |
| React/Next rendering or interaction bug | `debugging` | `react-next-frontend`, `ui-system`, `state-management`, testing | Reproduction, component tests, build/type check as available | Ask before broad architectural migration |
| State architecture or state bug | `state-management` | `react-next-frontend`, `debugging`, testing | Store/hydration tests and behavior regression | Ask before adding a second state library |
| UI-only change in any web stack | `ui-system` | Relevant framework skill, `reference-driven-build` when using a visual reference, testing | Responsive, accessibility, interaction, and visual checks | No approval for routine local edits |
| Screenshot, design, uploaded docs, GitHub example, or version-sensitive reference | `reference-driven-build` | Relevant framework/domain skill, `ui-system`, testing | Version/API validation and rendered reference comparison where possible | Respect normal external-write and production approval boundaries |
| API feature | `express-nest-backend` | `typescript-engineering`, `auth-security`, testing | Validation, API/integration tests | Ask before external side effects |
| API security or access-control issue | `auth-security` | `debugging`, backend, testing, review | Negative authorization tests and regression tests | Escalate ambiguous policy; never weaken access controls silently |
| Schema/data-model change | `database-engineering` | Backend, testing, `deployment-ops`, review | Migration inspection, constraints, query/tests | Approval before production migration or destructive data changes |
| Production bug | `debugging` | Relevant domain skill, testing, review | Reproduction, regression test, targeted checks | Approval for production changes or risky data operations |
| Test/CI failure | `testing-quality-gates` | `debugging`, `git-cicd` | Re-run failing check and relevant suite | Ask before changing protected CI/security settings |
| Pull request review | `production-code-review` | Security, database, testing, relevant domain | Evidence-backed findings and changed-line review | Review only unless asked to implement |
| GitHub Actions or release workflow | `git-cicd` | Testing, deployment ops, security | Workflow/config validation and least-privilege review | Approval before release/push/history rewrite |
| Deployment failure | `debugging` | `deployment-ops`, `git-cicd` | Logs, health checks, rollback readiness | Approval before production changes/restart/migration |
| Production deployment | `deployment-ops` | `git-cicd`, testing, database, review | Preflight, health checks, rollback verification | Explicit authorization for production deployment |
| PHP/Laravel or unfamiliar architecture | Relevant domain skill | `feature-planner`, debugging, testing | Small steps and framework-native checks | Ask if assumptions materially affect data/security |

## Skill inventory

1. `feature-planner` — requirements, scope, acceptance criteria, implementation plan.
2. `typescript-engineering` — type safety, runtime boundaries, safe async code.
3. `react-next-frontend` — React and Next.js rendering/data/forms/testing.
4. `state-management` — choosing and testing local/shared/server state tools.
5. `ui-system` — Tailwind, shadcn/ui, design consistency and accessibility.
6. `express-nest-backend` — API boundaries and Express/Nest patterns.
7. `database-engineering` — PostgreSQL, MongoDB, Drizzle, Prisma and migrations.
8. `auth-security` — authentication, authorization, sessions and trust boundaries.
9. `debugging` — evidence-driven root-cause analysis.
10. `testing-quality-gates` — test selection and honest quality gates.
11. `git-cicd` — safe Git, GitHub Actions and releases.
12. `deployment-ops` — hosting, reverse proxies, process supervision and recovery.
13. `production-code-review` — evidence-backed risk and defect review.
14. `reference-driven-build` — implementation from visual and technical references with version-aware validation.

## Standard workflow

- **Understand:** clarify the outcome and observable acceptance criteria.
- **Inspect:** read project instructions, Git status, manifests, versions, nearby code and tests.
- **Plan:** identify the smallest safe change; plan explicitly for complex or cross-cutting work.
- **Implement:** follow established conventions and preserve unrelated modifications.
- **Verify:** run relevant tests/checks and record exact commands/results.
- **Review:** inspect the diff, security boundaries, regressions and migration/deployment impact.
- **Report:** summarize changed files, verified results, unresolved risks and next steps.

For trivial changes, keep the workflow lightweight. Never claim commands ran or passed unless their results were observed.

## Future extensions

Add PHP/Laravel, Docker, observability/incident response, documentation automation, repository-specific architecture, MCP integrations, or evaluation harnesses as separate skills. Do not make them prerequisites for the core system.
