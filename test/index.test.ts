import { describe, expect, test } from 'bun:test';
import pkg from '../package.json' assert { type: 'json' };

describe('dist files', () => {
  const distFiles = ['package.json', 'action.yml', 'index.mjs'];

  for (const filename of distFiles) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    test(`"${filename}" exists`, () => {
      const file = Bun.file(filename);
      expect(file.exists()).resolves.toBeTruthy();
      expect(file.size).toBeGreaterThan(0);
    });
  }
});

describe('package.json', () => {
  test('has "type" set as "module"', () => {
    expect(pkg.type).toBe('module');
  });

  test('has correct "main" value', () => {
    expect(pkg.main).toBe('index.mjs');
  });
});
