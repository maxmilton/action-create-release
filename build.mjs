/* eslint-disable import/no-extraneous-dependencies */

import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    platform: 'node',
    target: ['node12'],
    banner: { js: '"use strict";' },
    bundle: true,
    minify: true,
    logLevel: 'debug',
  })
  .catch((error) => {
    throw error;
  });
