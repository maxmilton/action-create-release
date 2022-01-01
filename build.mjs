/* eslint-disable import/no-extraneous-dependencies */

import esbuild from 'esbuild';
import { decodeUTF8, encodeUTF8, writeFiles } from 'esbuild-minify-templates';
import path from 'path';

/** @type {esbuild.Plugin} */
const analyzeMeta = {
  name: 'analyze-meta',
  setup(build) {
    if (!build.initialOptions.metafile) return;

    build.onEnd(
      (result) => result.metafile
        && build.esbuild.analyzeMetafile(result.metafile).then(console.log),
    );
  },
};

/** @type {esbuild.Plugin} */
const minifyJS = {
  name: 'minify-js',
  setup(build) {
    build.onEnd(async (result) => {
      if (!result.outputFiles) return;

      for (let index = 0; index < result.outputFiles.length; index++) {
        const file = result.outputFiles[index];

        if (path.extname(file.path) === '.js') {
          // eslint-disable-next-line no-await-in-loop
          const out = await build.esbuild.transform(decodeUTF8(file.contents), {
            loader: 'js',
            minify: true,
          });

          // eslint-disable-next-line no-param-reassign
          result.outputFiles[index].contents = encodeUTF8(out.code);
        }
      }
    });
  },
};

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  target: ['node12'],
  plugins: [minifyJS, writeFiles(), analyzeMeta],
  banner: { js: '"use strict";' },
  bundle: true,
  minify: true,
  write: false,
  legalComments: 'external',
  metafile: process.stdout.isTTY,
  logLevel: 'debug',
});
