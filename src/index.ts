import { run } from './action';

// HACK: Workaround for bun not outputting compatible code for Node.js
// eslint-disable-next-line unicorn/prefer-module
import.meta.require ??= require;

void run();
