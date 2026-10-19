---
name: database-engineering
description: "Use for PostgreSQL or MongoDB modeling, Drizzle/Prisma queries, schema changes, indexes, transactions, backfills, and migration safety."
---

# Protect data integrity across data layers


## Purpose and scope
Make data-layer changes that preserve integrity, concurrency correctness, and operational recoverability.

## Activation conditions
Use for schema/model changes, ORM queries, performance, indexes, relationships, transactions, data cleanup/backfills, or migration planning.

## Required context
Inspect database engine/version, schema/models, ORM and version, migration history/configuration, constraints/indexes, query patterns, data volume assumptions, and backup/restore arrangements. When supplied docs, URLs, or GitHub examples affect implementation, also use `reference-driven-build` to establish source authority and version compatibility.

## Step-by-step workflow
1. Identify the source of truth and all reads/writes affected.
2. Check existing constraints, indexes, relationships, nullability, deletion behavior, and data assumptions.
3. Design the smallest schema/query change and assess locks, table rewrites, backfill cost, and compatibility.
4. Review generated migration SQL and ORM-specific output before applying it.
5. Prefer expand → migrate/backfill → switch readers/writers → contract for risky production changes.
6. Use transactions and constraints to enforce invariants under concurrency.
7. Add tests for integrity, boundary cases, and rollback/failure behavior.
8. Document backup, rollout, monitoring, and rollback limits.

## Engineering standards
- **PostgreSQL:** use constraints, suitable indexes, transactions, explain plans when useful, and explicit locking/concurrency analysis for contested writes.
- **MongoDB:** model around access patterns; evaluate document growth, embedding vs references, indexes, atomicity, and multi-document transaction costs.
- **Drizzle ORM:** inspect schema definitions, `drizzle.config.*`, generated SQL, migration history, and the chosen `generate`/`migrate`/`push` workflow. Do not assume its API or migration behavior matches Prisma.
- **Prisma ORM:** inspect `schema.prisma`, client version, generated client, migration history, and the actual `prisma migrate` workflow. Do not substitute Drizzle commands.
- Match Drizzle and Prisma APIs and migration guidance to the installed CLI/client versions. Prefer version-matched official docs; check generated types, local source, or generated SQL where docs/examples are ambiguous.
- Treat ORM examples as demonstrations, not as evidence that the target project's schema, constraints, transaction policy, or migration workflow is equivalent.
- **Native SQL:** parameterize values, inspect query plans and database-specific syntax, and keep SQL changes covered by integration tests.
- Never assume a migration is reversible. Column drops, type conversions, destructive transforms, and data rewrites may lose information.
- Design indexes for real query predicates/orderings and account for write/storage overhead.
- Use idempotent backfills with progress/resume strategy when suitable.

## Common anti-patterns
- Applying generated migrations without inspecting SQL.
- Using `push` in place of a controlled migration workflow without understanding project policy.
- Assuming ORM type safety guarantees relational integrity.
- Copying an ORM snippet from a floating GitHub branch without checking version, generated SQL, and migration consequences.
- Ignoring N+1 queries, pagination stability, or concurrent writes.
- Renaming/dropping columns before all deployed readers/writers are compatible.
- Treating rollback as automatic data restoration.

## Security considerations
Use parameterized queries, least-privilege DB roles, access controls, safe logs, and validated filters. Never expose database credentials. Protect sensitive data in backups and test fixtures.

## Verification requirements
Run ORM/schema validation and relevant tests. Inspect migration SQL, constraints/indexes, query plans when relevant, and status of migration history. Never apply production migrations as part of routine code generation without explicit authorization.

## Completion-report format
Report model/query changes, migration operations and reversibility, integrity/performance impact, backup/rollout concerns, and observed checks.

