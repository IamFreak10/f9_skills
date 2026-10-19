'use strict';

const path = require('path');
const { VERSION, PKG_NAME, KNOWN_SKILLS } = require('./constants');
const { installSkills, getAvailableSkills, findPackageRoot } = require('./installer');

// Lightweight ANSI formatting (respects NO_COLOR and non-TTY)
function createStyler(stream = process.stdout) {
  const isEnabled = stream.isTTY && !process.env.NO_COLOR && process.env.TERM !== 'dumb';
  const wrap = (open, close) => (str) => (isEnabled ? `\x1b[${open}m${str}\x1b[${close}m` : String(str));

  return {
    bold: wrap('1', '22'),
    dim: wrap('2', '22'),
    cyan: wrap('36', '39'),
    green: wrap('32', '39'),
    yellow: wrap('33', '39'),
    red: wrap('31', '39'),
    gray: wrap('90', '39')
  };
}

/**
 * Parse CLI arguments into command, options, and positional args.
 */
function parseArgs(args) {
  const parsed = {
    command: null,
    target: '.',
    mode: 'agents',
    skills: null,
    includeTemplates: true,
    includeRules: true,
    dryRun: false,
    force: false,
    help: false,
    version: false,
    unknownOptions: [],
    unknownCommands: []
  };

  const positional = [];
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      i++;
    } else if (arg === '--version' || arg === '-v') {
      parsed.version = true;
      i++;
    } else if (arg === '--dry-run' || arg === '-d' || arg === '-n') {
      parsed.dryRun = true;
      i++;
    } else if (arg === '--force' || arg === '-f') {
      parsed.force = true;
      i++;
    } else if (arg === '--agents') {
      parsed.mode = 'agents';
      i++;
    } else if (arg === '--claude') {
      parsed.mode = 'claude';
      i++;
    } else if (arg === '--all' || arg === '--both') {
      parsed.mode = 'both';
      i++;
    } else if (arg === '--no-templates') {
      parsed.includeTemplates = false;
      i++;
    } else if (arg === '--no-rules') {
      parsed.includeRules = false;
      i++;
    } else if (arg === '--target' || arg === '-t') {
      if (i + 1 >= args.length) {
        throw new Error('Option --target requires a directory path argument.');
      }
      parsed.target = args[i + 1];
      i += 2;
    } else if (arg.startsWith('--target=')) {
      parsed.target = arg.slice('--target='.length);
      i++;
    } else if (arg === '--mode' || arg === '-m') {
      if (i + 1 >= args.length) {
        throw new Error('Option --mode requires an argument (agents, claude, or both).');
      }
      parsed.mode = args[i + 1];
      i += 2;
    } else if (arg.startsWith('--mode=')) {
      parsed.mode = arg.slice('--mode='.length);
      i++;
    } else if (arg === '--skills' || arg === '-s') {
      if (i + 1 >= args.length) {
        throw new Error('Option --skills requires a comma-separated list of skill names.');
      }
      parsed.skills = args[i + 1].split(',').map((s) => s.trim()).filter(Boolean);
      i += 2;
    } else if (arg.startsWith('--skills=')) {
      parsed.skills = arg.slice('--skills='.length).split(',').map((s) => s.trim()).filter(Boolean);
      i++;
    } else if (arg.startsWith('-')) {
      parsed.unknownOptions.push(arg);
      i++;
    } else {
      positional.push(arg);
      i++;
    }
  }

  if (positional.length > 0) {
    parsed.command = positional[0];
    if (positional.length > 1) {
      parsed.unknownCommands = positional.slice(1);
    }
  }

  return parsed;
}

/**
 * Print main help documentation.
 */
function printHelp(out = console.log, styler = createStyler()) {
  const { bold, cyan, yellow, dim } = styler;
  out(`
${bold(cyan('AI Developer Skills Ecosystem CLI'))} ${dim(`(v${VERSION})`)}
Portable engineering playbooks and skills for coding agents.

${bold('USAGE')}
  ${cyan('npx github:IamFreak10/f9_skills')} ${yellow('<command>')} [options]
  ${dim('# Or with -y for non-interactive / CI automation:')}
  ${cyan('npx -y github:IamFreak10/f9_skills')} ${yellow('<command>')} [options]

${bold('COMMANDS')}
  ${yellow('init')}                 Install skills, templates, and agent rules into project
  ${yellow('list')}                 Display available skills and descriptions
  ${yellow('help')}                 Display this help information
  ${yellow('version')}              Show CLI version

${bold('INIT OPTIONS')}
  ${cyan('-t, --target <dir>')}     Target directory for installation ${dim('(default: current directory)')}
  ${cyan('--agents')}             Install canonical portable layout: ${dim('.agents/skills/ + AGENTS.md (default)')}
  ${cyan('--claude')}             Install native Claude Code layout: ${dim('.claude/skills/ + CLAUDE.md')}
  ${cyan('--all, --both')}        Install both .agents/skills/ and .claude/skills/
  ${cyan('-m, --mode <mode>')}      Installation mode: ${dim('agents | claude | both')}
  ${cyan('-s, --skills <list>')}    Install specific skills only ${dim('(comma-separated, e.g. auth-security,debugging)')}
  ${cyan('-d, --dry-run')}          Simulate installation without writing any files
  ${cyan('-f, --force')}            Overwrite conflicting files that have differing content
  ${cyan('--no-templates')}       Skip installing templates/ directory
  ${cyan('--no-rules')}           Skip installing AGENTS.md / CLAUDE.md
  ${cyan('-h, --help')}             Show help for init command

${bold('EXAMPLES')}
  ${dim('# 1. Install canonical .agents/skills/ into current project:')}
  ${cyan('npx -y github:IamFreak10/f9_skills init')}

  ${dim('# 2. Install native Claude Code skills (.claude/skills/):')}
  ${cyan('npx -y github:IamFreak10/f9_skills init --claude')}

  ${dim('# 3. Install both agent formats:')}
  ${cyan('npx -y github:IamFreak10/f9_skills init --all')}

  ${dim('# 4. Preview installation safely without writing anything to disk:')}
  ${cyan('npx -y github:IamFreak10/f9_skills init --dry-run')}

  ${dim('# 5. Install into a specific folder:')}
  ${cyan('npx -y github:IamFreak10/f9_skills init --target ./my-app')}

  ${dim('# 6. Install only specific skills:')}
  ${cyan('npx -y github:IamFreak10/f9_skills init --skills auth-security,debugging')}
`);
}

/**
 * Print skill inventory list.
 */
function printSkillsList(out = console.log, styler = createStyler()) {
  const { bold, cyan, dim, green } = styler;
  const pkgRoot = findPackageRoot();
  const available = getAvailableSkills(pkgRoot);

  out(`\n${bold(cyan('Available AI Skills'))} ${dim(`(${available.length} skills in ecosystem)`)}:\n`);

  for (const name of available) {
    const known = KNOWN_SKILLS.find((k) => k.name === name);
    const desc = known ? known.desc : 'Custom skill module';
    out(`  ${green('●')} ${bold(name.padEnd(25))} ${dim(desc)}`);
  }

  out(`\nRun ${cyan('npx -y github:IamFreak10/f9_skills init')} to install all skills into your project.\n`);
}

/**
 * Execute the CLI command.
 */
async function runCLI(rawArgs = process.argv.slice(2), { stdout = process.stdout, stderr = process.stderr } = {}) {
  const styler = createStyler(stdout);
  const { bold, cyan, green, yellow, red, dim, gray } = styler;
  const log = (msg = '') => stdout.write(msg + '\n');
  const errLog = (msg = '') => stderr.write(msg + '\n');

  let parsed;
  try {
    parsed = parseArgs(rawArgs);
  } catch (err) {
    errLog(`${red('Error:')} ${err.message}`);
    errLog(`Run ${cyan('f9_skills --help')} for available options.`);
    return 1;
  }

  // Handle version
  if (parsed.version || parsed.command === 'version') {
    log(`f9_skills v${VERSION}`);
    return 0;
  }

  // Handle help
  if (parsed.help || parsed.command === 'help' || (!parsed.command && rawArgs.length === 0)) {
    printHelp(log, styler);
    return 0;
  }

  // Check for unknown options
  if (parsed.unknownOptions.length > 0) {
    errLog(`${red('Error:')} Unknown option(s): ${parsed.unknownOptions.join(', ')}`);
    errLog(`Run ${cyan('f9_skills --help')} to view supported flags.`);
    return 1;
  }

  // Check for unrecognized command
  if (parsed.command && !['init', 'install', 'list'].includes(parsed.command)) {
    errLog(`${red('Error:')} Unknown command: "${parsed.command}"`);
    errLog(`Run ${cyan('f9_skills --help')} to view available commands.`);
    return 1;
  }

  if (parsed.unknownCommands.length > 0) {
    errLog(`${red('Error:')} Unexpected argument(s): ${parsed.unknownCommands.join(', ')}`);
    return 1;
  }

  // Command: list
  if (parsed.command === 'list') {
    printSkillsList(log, styler);
    return 0;
  }

  // Command: init / install
  if (parsed.command === 'init' || parsed.command === 'install') {
    const targetPath = path.resolve(parsed.target);

    log(`\n${bold(cyan('⚡ AI Developer Skills Ecosystem Installer'))} ${dim(`v${VERSION}`)}`);
    log(`${dim('Target directory:')} ${targetPath}`);
    log(`${dim('Mode:')}             ${parsed.mode} ${parsed.mode === 'both' ? '(.agents/ + .claude/)' : parsed.mode === 'claude' ? '(.claude/skills/)' : '(.agents/skills/)'}`);
    if (parsed.dryRun) {
      log(`${yellow('[DRY RUN]')}        Simulation mode enabled; no changes will be written.`);
    }
    log('');

    let result;
    try {
      result = installSkills({
        targetDir: targetPath,
        mode: parsed.mode,
        skills: parsed.skills,
        includeTemplates: parsed.includeTemplates,
        includeRules: parsed.includeRules,
        dryRun: parsed.dryRun,
        force: parsed.force
      });
    } catch (err) {
      errLog(`${red('Error:')} ${err.message}`);
      return 1;
    }

    // Display file results
    for (const item of result.results) {
      if (item.status === 'created') {
        log(`  ${green('✔')} ${bold('[created]')}    ${item.path}`);
      } else if (item.status === 'unchanged') {
        log(`  ${gray('ℹ')} ${dim('[unchanged]')}  ${dim(item.path)}`);
      } else if (item.status === 'overwritten') {
        log(`  ${yellow('✔')} ${yellow('[overwritten]')} ${item.path}`);
      } else if (item.status === 'conflict') {
        log(`  ${yellow('⚠')} ${yellow('[conflict]')}   ${bold(item.path)} ${dim('(differing user file preserved; skipped)')}`);
      }
    }

    // Print summary stats
    log(`\n${bold('Summary:')}`);
    log(`  ${green('✔')} Created:     ${result.stats.created} file(s)`);
    log(`  ${gray('ℹ')} Unchanged:   ${result.stats.unchanged} file(s)`);
    if (result.stats.overwritten > 0) {
      log(`  ${yellow('✔')} Overwritten: ${result.stats.overwritten} file(s)`);
    }
    if (result.stats.conflicts > 0) {
      log(`  ${yellow('⚠')} Conflicts:   ${result.stats.conflicts} file(s) ${yellow('(preserved without changes)')}`);
      log(`\n${yellow('Note:')} Existing files with differing content were preserved to protect user work.`);
      log(`Pass ${cyan('--force')} if you want to overwrite existing files with ecosystem defaults.`);
    }

    if (result.dryRun) {
      log(`\n${yellow('[DRY RUN]')} Simulation complete. Re-run without ${cyan('--dry-run')} to write files.\n`);
    } else if (result.stats.created > 0 || result.stats.overwritten > 0) {
      log(`\n${green('✔ Installation complete!')} Skills are ready for your coding agents.\n`);
    } else {
      log(`\n${green('✔ Up to date!')} All skills and files are already in place.\n`);
    }

    return 0;
  }

  // Fallback
  printHelp(log, styler);
  return 0;
}

module.exports = {
  runCLI,
  parseArgs,
  printHelp,
  printSkillsList,
  createStyler
};
