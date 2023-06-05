// https://github.com/actions/create-release
// https://github.com/actions/toolkit/tree/master/packages/core
// https://github.com/actions/toolkit/tree/master/packages/github

/// <reference types="node" />

import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  info,
  setFailed,
} from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

process.on('uncaughtExceptionMonitor', setFailed);
process.on('unhandledRejection', setFailed);

type Await<T> = T extends Promise<infer U> ? U : T;

export async function run(): Promise<void> {
  let octokit: ReturnType<typeof getOctokit>;
  let release: Await<ReturnType<typeof octokit.rest.repos.createRelease>>;

  try {
    const token = getInput('github-token', { required: true });
    const gitTag = getInput('git-tag', { required: true }).replace(
      'refs/tags/',
      '',
    );
    const draft = getBooleanInput('draft');
    const files = getMultilineInput('files');
    const uploads = [];

    octokit = getOctokit(token);

    // https://octokit.github.io/rest.js/v18/#repos-create-release
    release = await octokit.rest.repos.createRelease({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name: gitTag,
      name: gitTag,
      // body: '',
      // create as draft so a human still needs to review and publish
      draft,
      // assume prerelease tags look like vx.x.x-beta.1
      prerelease: gitTag.includes('-'),
      target_commitish: context.sha,
    });

    for (const file of files) {
      // https://octokit.github.io/rest.js/v18/#repos-upload-release-asset
      uploads.push(
        readFile(resolve(file)).then((data) =>
          octokit.rest.repos.uploadReleaseAsset({
            owner: context.repo.owner,
            repo: context.repo.repo,
            release_id: release.data.id,
            // TODO: Handle files types other than .zip
            headers: { 'content-type': 'application/zip' },
            name: basename(file),
            // @ts-expect-error - Buffer is actually correct, otherwise file is broken
            data,
          }),
        ),
      );
    }

    await Promise.all(uploads);

    info(`Git tag: ${gitTag}`);
    info(`Release URL: ${release.data.html_url}`);
  } catch (error) {
    // @ts-expect-error - safe use before define
    if (octokit && release) {
      try {
        await octokit.rest.repos.deleteRelease({
          owner: context.repo.owner,
          repo: context.repo.repo,
          release_id: release.data.id,
        });
      } catch {
        /* noop */
      }
    }

    setFailed(error as Error);
  }
}
