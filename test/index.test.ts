import { describe, expect, test } from 'bun:test';
import pkg from '../package.json' assert { type: 'json' };

describe('dist files', () => {
  const distFiles = ['package.json', 'action.yml', 'index.mjs'];

  for (const filename of distFiles) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    test(`"${filename}" exists`, () => {
      expect.assertions(2);
      const file = Bun.file(filename);
      expect(file.exists()).resolves.toBeTruthy();
      expect(file.size).toBeGreaterThan(0);
    });
  }
});

describe('package.json', () => {
  test('is an object', () => {
    expect.assertions(1);
    expect(pkg).toBePlainObject();
  });

  test('is valid JSON', () => {
    expect.assertions(1);
    // eslint-disable-next-line unicorn/prefer-structured-clone
    expect(JSON.parse(JSON.stringify(pkg))).toEqual(pkg);
  });

  test('has "type" set as "module"', () => {
    expect.assertions(1);
    expect(pkg.type).toBe('module');
  });

  test('has correct "main" value', () => {
    expect.assertions(1);
    expect(pkg.main).toBe('index.mjs');
  });
});
