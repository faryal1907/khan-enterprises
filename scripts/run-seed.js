#!/usr/bin/env node
// Lightweight launcher: register ts-node with desired compiler options and run the TS seeder
try {
  // Prefer a local ts-node if available
  const tsNode = require('ts-node');
  const { register } = tsNode;
  register({ transpileOnly: true, compilerOptions: { moduleResolution: 'NodeNext' } });
} catch (e) {
  // Fall back to runtime requiring 'ts-node/register'
  try {
    require('ts-node/register');
  } catch (err) {
    console.error('ts-node is not available. Please install it (npm i -D ts-node) or run via npx.');
    console.error(err);
    process.exit(1);
  }
}

// Now require the seed file
require('../packages/prisma/seed.ts');
