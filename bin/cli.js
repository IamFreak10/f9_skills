#!/usr/bin/env node
'use strict';

const { runCLI } = require('../src/cli');

runCLI(process.argv.slice(2))
  .then((exitCode) => {
    process.exitCode = typeof exitCode === 'number' ? exitCode : 0;
  })
  .catch((err) => {
    console.error(`\nFatal error: ${err.message || err}`);
    process.exit(1);
  });
