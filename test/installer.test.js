'use strict';

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { installSkills, getAvailableSkills, findPackageRoot } = require('../src/installer');

describe('installer core tests', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'f9-skills-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('locates package root and discovers all 13 skills', () => {
    const root = findPackageRoot();
    assert.ok(fs.existsSync(root));
    const skills = getAvailableSkills(root);
    assert.equal(skills.length, 13);
    assert.ok(skills.includes('auth-security'));
    assert.ok(skills.includes('feature-planner'));
    assert.ok(skills.includes('debugging'));
  });

  test('installs canonical .agents/skills/, templates, and AGENTS.md in default agents mode', () => {
    const res = installSkills({ targetDir: tempDir, mode: 'agents' });

    assert.equal(res.hasConflicts, false);
    assert.equal(res.stats.created, 13 + 3 + 1); // 13 skills + 3 templates + AGENTS.md
    assert.equal(res.stats.unchanged, 0);
    assert.equal(res.stats.conflicts, 0);

    // Verify files on disk
    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'auth-security', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'debugging', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'templates', 'feature-plan.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'templates', 'code-review.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'templates', 'deployment-checklist.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'AGENTS.md')));
    // In agents mode, CLAUDE.md and .claude should not be created
    assert.equal(fs.existsSync(path.join(tempDir, 'CLAUDE.md')), false);
    assert.equal(fs.existsSync(path.join(tempDir, '.claude')), false);
  });

  test('installs .claude/skills/, templates, and CLAUDE.md in claude mode', () => {
    const res = installSkills({ targetDir: tempDir, mode: 'claude' });

    assert.equal(res.hasConflicts, false);
    assert.equal(res.stats.created, 13 + 3 + 1);
    assert.ok(fs.existsSync(path.join(tempDir, '.claude', 'skills', 'auth-security', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'CLAUDE.md')));
    assert.equal(fs.existsSync(path.join(tempDir, '.agents')), false);
    assert.equal(fs.existsSync(path.join(tempDir, 'AGENTS.md')), false);
  });

  test('installs both .agents/ and .claude/ in both mode', () => {
    const res = installSkills({ targetDir: tempDir, mode: 'both' });

    assert.equal(res.hasConflicts, false);
    assert.equal(res.stats.created, 13 * 2 + 3 + 2); // 26 skill files + 3 templates + 2 rules
    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'git-cicd', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, '.claude', 'skills', 'git-cicd', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'AGENTS.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'CLAUDE.md')));
  });

  test('repeated runs are idempotent and report 0 created, all unchanged', () => {
    const firstRun = installSkills({ targetDir: tempDir, mode: 'agents' });
    assert.equal(firstRun.stats.created, 17);

    const secondRun = installSkills({ targetDir: tempDir, mode: 'agents' });
    assert.equal(secondRun.stats.created, 0);
    assert.equal(secondRun.stats.unchanged, 17);
    assert.equal(secondRun.stats.conflicts, 0);
    assert.equal(secondRun.stats.overwritten, 0);
    assert.equal(secondRun.hasConflicts, false);
  });

  test('conflict safety: preserves existing user modifications without overwriting', () => {
    // 1. Initial install
    installSkills({ targetDir: tempDir, mode: 'agents' });

    // 2. User customizes AGENTS.md and one skill
    const userRulePath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(userRulePath, '# Custom User Rules - Do Not Overwrite\nMy custom rule');

    const userSkillPath = path.join(tempDir, '.agents', 'skills', 'auth-security', 'SKILL.md');
    fs.writeFileSync(userSkillPath, '# Custom Auth Security Skill\nCustom logic');

    // 3. Re-run without force
    const res = installSkills({ targetDir: tempDir, mode: 'agents', force: false });

    // Verify conflicts were caught and reported
    assert.equal(res.hasConflicts, true);
    assert.equal(res.stats.conflicts, 2);
    assert.equal(res.stats.created, 0);
    assert.equal(res.stats.unchanged, 15);

    // Verify user files were NOT modified or overwritten
    assert.equal(fs.readFileSync(userRulePath, 'utf8'), '# Custom User Rules - Do Not Overwrite\nMy custom rule');
    assert.equal(fs.readFileSync(userSkillPath, 'utf8'), '# Custom Auth Security Skill\nCustom logic');
  });

  test('force flag overwrites existing conflicting files', () => {
    installSkills({ targetDir: tempDir, mode: 'agents' });

    const userRulePath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(userRulePath, '# Custom User Rules');

    const res = installSkills({ targetDir: tempDir, mode: 'agents', force: true });

    assert.equal(res.hasConflicts, false);
    assert.equal(res.stats.overwritten, 1);
    assert.equal(res.stats.unchanged, 16);
    assert.notEqual(fs.readFileSync(userRulePath, 'utf8'), '# Custom User Rules');
  });

  test('dry-run does not write any files or directories', () => {
    const res = installSkills({ targetDir: tempDir, mode: 'agents', dryRun: true });

    assert.equal(res.stats.created, 17);
    assert.equal(res.dryRun, true);

    // Temp dir must remain completely empty
    const files = fs.readdirSync(tempDir);
    assert.equal(files.length, 0);
  });

  test('installs only a specified subset of skills', () => {
    const res = installSkills({
      targetDir: tempDir,
      mode: 'agents',
      skills: ['auth-security', 'debugging'],
      includeTemplates: false,
      includeRules: false
    });

    assert.equal(res.stats.created, 2);
    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'auth-security', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'debugging', 'SKILL.md')));
    assert.equal(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'git-cicd')), false);
  });

  test('throws on unknown skill name', () => {
    assert.throws(
      () => installSkills({ targetDir: tempDir, skills: ['non-existent-skill'] }),
      /Unknown skill/
    );
  });

  test('throws on invalid mode', () => {
    assert.throws(
      () => installSkills({ targetDir: tempDir, mode: 'invalid-mode' }),
      /Invalid mode/
    );
  });
});
