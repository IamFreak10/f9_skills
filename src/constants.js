'use strict';

const PKG_NAME = 'f9_skills';
const VERSION = '1.0.0';

const KNOWN_SKILLS = [
  { name: 'feature-planner', desc: 'Requirements, scope, acceptance criteria, implementation plan' },
  { name: 'typescript-engineering', desc: 'Type safety, runtime boundaries, safe async code' },
  { name: 'react-next-frontend', desc: 'React and Next.js rendering, data fetching, forms, component testing' },
  { name: 'state-management', desc: 'Choosing and testing local, shared, and server state tools' },
  { name: 'ui-system', desc: 'Tailwind, shadcn/ui, design consistency, and accessibility' },
  { name: 'express-nest-backend', desc: 'API boundaries, contracts, middleware, and Express/Nest patterns' },
  { name: 'database-engineering', desc: 'PostgreSQL, MongoDB, Drizzle, Prisma, and migration safety' },
  { name: 'auth-security', desc: 'Authentication, authorization, sessions, and trust boundaries' },
  { name: 'debugging', desc: 'Evidence-driven root-cause analysis and runtime troubleshooting' },
  { name: 'testing-quality-gates', desc: 'Test selection, honest quality gates, and regression coverage' },
  { name: 'git-cicd', desc: 'Safe Git, GitHub Actions, workflows, and release pipelines' },
  { name: 'deployment-ops', desc: 'Hosting, reverse proxies, process supervision, and recovery' },
  { name: 'production-code-review', desc: 'Evidence-backed risk, defect, and migration review' },
  { name: 'reference-driven-build', desc: 'Implementation from screenshots, docs, GitHub examples, and version-matched references' }
];

const TEMPLATES = [
  'code-review.md',
  'deployment-checklist.md',
  'feature-plan.md'
];

module.exports = {
  PKG_NAME,
  VERSION,
  KNOWN_SKILLS,
  TEMPLATES
};
