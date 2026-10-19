'use strict';

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const CLI_PATH = path.resolve(__dirname, '..', 'bin', 'cli.js');

function runCLIProcess(args, cwd = process.cwd()) {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' }
  });
  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

describe('cli end-to-end tests', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'f9-cli-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('cli init creates skills, templates, and AGENTS.md in target directory', () => {
    const { code, stdout, stderr } = runCLIProcess(['init', '--target', tempDir]);

    assert.equal(code, 0, `Process failed with stderr: ${stderr}`);
    assert.match(stdout, /Installation complete/);
    assert.match(stdout, /Created:\s+17 file\(s\)/);

    assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'skills', 'auth-security', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'templates', 'feature-plan.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'AGENTS.md')));
  });

  test('cli init repeated run is idempotent (reports 0 created, 17 unchanged)', () => {
    runCLIProcess(['init', '--target', tempDir]);

    const second = runCLIProcess(['init', '--target', tempDir]);
    assert.equal(second.code, 0);
    assert.match(second.stdout, /Created:\s+0 file\(s\)/);
    assert.match(second.stdout, /Unchanged:\s+17 file\(s\)/);
    assert.match(second.stdout, /Up to date!/);
  });

  test('cli init with claude flag installs .claude/skills and CLAUDE.md', () => {
    const { code, stdout } = runCLIProcess(['init', '--target', tempDir, '--claude']);

    assert.equal(code, 0);
    assert.ok(fs.existsSync(path.join(tempDir, '.claude', 'skills', 'auth-security', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(tempDir, 'CLAUDE.md')));
    assert.equal(fs.existsSync(path.join(tempDir, '.agents')), false);
  });

  test('cli init protects existing user modifications (conflict safety)', () => {
    runCLIProcess(['init', '--target', tempDir]);

    const agentsRulePath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(agentsRulePath, '# Modified User Instructions\nCustom rule');

    const res = runCLIProcess(['init', '--target', tempDir]);
    assert.equal(res.code, 0);
    assert.match(res.stdout, /Conflicts:\s+1 file\(s\)/);
    assert.match(res.stdout, /Existing files with differing content were preserved/);

    // Verify content was untouched
    assert.equal(fs.readFileSync(agentsRulePath, 'utf8'), '# Modified User Instructions\nCustom rule');
  });

  test('cli init with --force overwrites conflicting files', () => {
    runCLIProcess(['init', '--target', tempDir]);

    const agentsRulePath = path.join(tempDir, 'AGENTS.md');
    fs.writeFileSync(agentsRulePath, '# Modified User Instructions');

    const res = runCLIProcess(['init', '--target', tempDir, '--force']);
    assert.equal(res.code, 0);
    assert.match(res.stdout, /Overwritten:\s+1 file\(s\)/);
    assert.notEqual(fs.readFileSync(agentsRulePath, 'utf8'), '# Modified User Instructions');
  });

  test('cli init with --dry-run writes nothing to disk', () => {
    const res = runCLIProcess(['init', '--target', tempDir, '--dry-run']);
    assert.equal(res.code, 0);
    assert.match(res.stdout, /\[DRY RUN\]/);
    assert.match(res.stdout, /Simulation complete/);

    const files = fs.readdirSync(tempDir);
    assert.equal(files.length, 0);
  });

  test('cli list prints inventory of 13 skills', () => {
    const { code, stdout } = runCLIProcess(['list']);
    assert.equal(code, 0);
    assert.match(stdout, /Available AI Skills \(13 skills in ecosystem\)/);
    assert.match(stdout, /auth-security/);
    assert.match(stdout, /feature-planner/);
    assert.match(stdout, /typescript-engineering/);
    assert.match(stdout, /production-code-review/);
  });

  test('cli --help and --version exit with code 0', () => {
    const helpRes = runCLIProcess(['--help']);
    assert.equal(helpRes.code, 0);
    assert.match(helpRes.stdout, /USAGE/);

    const versionRes = runCLIProcess(['--version']);
    assert.equal(versionRes.code, 0);
    assert.match(versionRes.stdout, /f9_skills v1\.0\.0/);
  });

  test('cli rejects unknown options with code 1 and helpful error message', () => {
    const res = runCLIProcess(['init', '--bad-option']);
    assert.equal(res.code, 1);
    assert.match(res.stderr, /Unknown option\(s\): --bad-option/);
    assert.match(res.stderr, /Run f9_skills --help/);
  });

  test('cli rejects unknown command with code 1 and error', () => {
    const res = runCLIProcess(['unknown-command']);
    assert.equal(res.code, 1);
    assert.match(res.stderr, /Unknown command: "unknown-command"/);
  });

  test('cli rejects invalid mode with code 1 and error', () => {
    const res = runCLIProcess(['init', '--mode', 'xyz', '--target', tempDir]);
    assert.equal(res.code, 1);
    assert.match(res.stderr, /Invalid mode: "xyz"/);
  });

  test('cli rejects unknown skill with code 1 and error', () => {
    const res = runCLIProcess(['init', '--skills', 'non-existent-skill', '--target', tempDir]);
    assert.equal(res.code, 1);
    assert.match(res.stderr, /Unknown skill\(s\): non-existent-skill/);
  });
});
