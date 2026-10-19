'use strict';

const fs = require('fs');
const path = require('path');
const { KNOWN_SKILLS, TEMPLATES } = require('./constants');

/**
 * Locate the root directory of the f9_skills package.
 */
function findPackageRoot() {
  const root = path.resolve(__dirname, '..');
  const canonicalSkillsDir = path.join(root, '.agents', 'skills');
  if (!fs.existsSync(canonicalSkillsDir)) {
    throw new Error(`Package root invalid: missing canonical skills directory at ${canonicalSkillsDir}`);
  }
  return root;
}

/**
 * Retrieve list of skills present in the canonical .agents/skills directory.
 */
function getAvailableSkills(pkgRoot = findPackageRoot()) {
  const skillsDir = path.join(pkgRoot, '.agents', 'skills');
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();
}

/**
 * Recursively find all files within a directory relative to the directory.
 */
function collectFilesRecursively(baseDir, currentSubdir = '') {
  const dir = path.join(baseDir, currentSubdir);
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const relativePath = currentSubdir ? path.join(currentSubdir, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(collectFilesRecursively(baseDir, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

/**
 * Synchronize a single file safely.
 *
 * @param {string} srcPath - Absolute source path.
 * @param {string} destPath - Absolute destination path.
 * @param {string} displayPath - Relative path for reporting.
 * @param {string} category - Category ('skill', 'template', 'rule').
 * @param {object} options - { dryRun, force }
 * @returns {object} Result record.
 */
function syncFile(srcPath, destPath, displayPath, category, { dryRun = false, force = false } = {}) {
  const srcContent = fs.readFileSync(srcPath);

  if (fs.existsSync(destPath)) {
    const destContent = fs.readFileSync(destPath);
    if (srcContent.equals(destContent)) {
      return {
        path: displayPath,
        destPath,
        category,
        status: 'unchanged',
        reason: 'Identical content already in place'
      };
    }

    if (force) {
      if (!dryRun) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, srcContent);
      }
      return {
        path: displayPath,
        destPath,
        category,
        status: 'overwritten',
        reason: 'Overwritten existing differing file (--force)'
      };
    }

    return {
      path: displayPath,
      destPath,
      category,
      status: 'conflict',
      reason: 'Existing file has differing content; preserved user changes. Pass --force to overwrite.'
    };
  }

  if (!dryRun) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, srcContent);
  }

  return {
    path: displayPath,
    destPath,
    category,
    status: 'created',
    reason: 'Installed new file'
  };
}

/**
 * Install AI skills, templates, and rules into the target project.
 *
 * @param {object} options
 * @param {string} [options.targetDir] - Destination project root directory.
 * @param {string} [options.mode='agents'] - 'agents' | 'claude' | 'both'.
 * @param {string[]} [options.skills] - Optional list of specific skills to install.
 * @param {boolean} [options.includeTemplates=true] - Install templates/.
 * @param {boolean} [options.includeRules=true] - Install AGENTS.md / CLAUDE.md.
 * @param {boolean} [options.dryRun=false] - Preview without making disk changes.
 * @param {boolean} [options.force=false] - Overwrite conflicting files.
 * @param {string} [options.pkgRoot] - Optional override for package root directory.
 */
function installSkills(options = {}) {
  const pkgRoot = options.pkgRoot || findPackageRoot();
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const mode = options.mode || 'agents';
  const includeTemplates = options.includeTemplates !== false;
  const includeRules = options.includeRules !== false;
  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);

  if (!['agents', 'claude', 'both'].includes(mode)) {
    throw new Error(`Invalid mode: "${mode}". Supported modes are: agents, claude, both.`);
  }

  const allSkills = getAvailableSkills(pkgRoot);
  let selectedSkills = allSkills;

  if (options.skills && options.skills.length > 0) {
    const unknown = options.skills.filter((s) => !allSkills.includes(s));
    if (unknown.length > 0) {
      throw new Error(`Unknown skill(s): ${unknown.join(', ')}. Available skills: ${allSkills.join(', ')}`);
    }
    selectedSkills = options.skills;
  }

  const results = [];
  const sourceSkillsBase = path.join(pkgRoot, '.agents', 'skills');

  // Determine skill target locations based on mode
  const targetLayouts = [];
  if (mode === 'agents' || mode === 'both') {
    targetLayouts.push({
      label: 'agents',
      baseDir: path.join(targetDir, '.agents', 'skills'),
      displayPrefix: '.agents/skills'
    });
  }
  if (mode === 'claude' || mode === 'both') {
    targetLayouts.push({
      label: 'claude',
      baseDir: path.join(targetDir, '.claude', 'skills'),
      displayPrefix: '.claude/skills'
    });
  }

  // Install skills
  for (const skill of selectedSkills) {
    const skillSourceDir = path.join(sourceSkillsBase, skill);
    const files = collectFilesRecursively(skillSourceDir);
    for (const layout of targetLayouts) {
      for (const file of files) {
        const srcPath = path.join(skillSourceDir, file);
        const destPath = path.join(layout.baseDir, skill, file);
        const displayPath = path.join(layout.displayPrefix, skill, file);
        results.push(syncFile(srcPath, destPath, displayPath, 'skill', { dryRun, force }));
      }
    }
  }

  // Install templates
  if (includeTemplates) {
    const templatesSourceDir = path.join(pkgRoot, 'templates');
    if (fs.existsSync(templatesSourceDir)) {
      const templateFiles = fs.readdirSync(templatesSourceDir).filter((f) => f.endsWith('.md'));
      for (const file of templateFiles) {
        const srcPath = path.join(templatesSourceDir, file);
        const destPath = path.join(targetDir, 'templates', file);
        const displayPath = path.join('templates', file);
        results.push(syncFile(srcPath, destPath, displayPath, 'template', { dryRun, force }));
      }
    }
  }

  // Install rules
  if (includeRules) {
    if (mode === 'agents' || mode === 'both') {
      const agentsRuleSrc = path.join(pkgRoot, 'AGENTS.md');
      if (fs.existsSync(agentsRuleSrc)) {
        const destPath = path.join(targetDir, 'AGENTS.md');
        results.push(syncFile(agentsRuleSrc, destPath, 'AGENTS.md', 'rule', { dryRun, force }));
      }
    }
    if (mode === 'claude' || mode === 'both') {
      const claudeRuleSrc = path.join(pkgRoot, 'CLAUDE.md');
      if (fs.existsSync(claudeRuleSrc)) {
        const destPath = path.join(targetDir, 'CLAUDE.md');
        results.push(syncFile(claudeRuleSrc, destPath, 'CLAUDE.md', 'rule', { dryRun, force }));
      }
    }
  }

  const stats = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    unchanged: results.filter((r) => r.status === 'unchanged').length,
    conflicts: results.filter((r) => r.status === 'conflict').length,
    overwritten: results.filter((r) => r.status === 'overwritten').length
  };

  return {
    targetDir,
    mode,
    dryRun,
    force,
    selectedSkills,
    results,
    stats,
    hasConflicts: stats.conflicts > 0
  };
}

module.exports = {
  findPackageRoot,
  getAvailableSkills,
  collectFilesRecursively,
  syncFile,
  installSkills
};
