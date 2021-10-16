// https://github.com/actions/create-release
// https://github.com/actions/toolkit/tree/master/packages/core
// https://github.com/actions/toolkit/tree/master/packages/github

import core from '@actions/core';
import github from '@actions/github';
import fs from 'fs';
import path from 'path';

process.on('uncaughtException', core.setFailed);
process.on('unhandledRejection', core.setFailed);

type Await<T> = T extends Promise<infer U> ? U : T;

export async function run(): Promise<void> {
  const cwd = process.cwd();
  let octokit: ReturnType<typeof github.getOctokit>;
  let release: Await<ReturnType<typeof octokit.rest.repos.createRelease>>;

  try {
    const token = core.getInput('github-token', { required: true });
    const gitTag = core
      .getInput('git-tag', { required: true })
      .replace('refs/tags/', '');
    const draft = core.getBooleanInput('draft');
    const files = core.getMultilineInput('files');

    octokit = github.getOctokit(token);

    // https://octokit.github.io/rest.js/v18/#repos-create-release
    release = await octokit.rest.repos.createRelease({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: gitTag,
      name: gitTag,
      // body: '',
      // create as draft so a human still needs to review and publish
      draft,
      // assume prerelease tags look like vx.x.x-beta.1
      prerelease: gitTag.includes('-'),
      target_commitish: github.context.sha,
    });

    const uploads = [];

    for (const file of files) {
      // https://octokit.github.io/rest.js/v18/#repos-upload-release-asset
      uploads.push(
        fs.promises.readFile(path.join(cwd, file)).then((data) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          octokit.rest.repos.uploadReleaseAsset({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            release_id: release.data.id,
            // FIXME: Handle files types other than .zip
            headers: { 'content-type': 'application/zip' },
            name: path.basename(file),
            // @ts-expect-error - Buffer is actually correct, otherwise file is broken
            data,
          })),
      );
    }

    await Promise.all(uploads);

    core.info(`Git tag: ${gitTag}`);
    core.info(`Release URL: ${release.data.html_url}`);
  } catch (error) {
    // @ts-expect-error - safe use before define
    if (octokit && release) {
      try {
        await octokit.rest.repos.deleteRelease({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          release_id: release.data.id,
        });
      } catch {
        /* noop */
      }
    }

    core.setFailed(error as Error);
  }
}
