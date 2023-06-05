import { createRequire } from 'node:module';
import { run } from './action';

// HACK: Workaround for bun not outputting compatible code for Node.js
import.meta.require = createRequire(import.meta.url);

void run();
