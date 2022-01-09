const getVersions = require('./getNewVersion');
const createPullRequest = require('./createPullRequest');
const createRelease = require('./createRelease');

const childProcess = require('child_process');
const changelog = require('generate-changelog');
const simpleGit = require('simple-git/promise');
const util = require('util');
const fs = require('fs');

const execPromisified = util.promisify(childProcess.exec);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

(async () => {
  try {
    const options = {
      baseDir: process.cwd(),
    };

    const git = simpleGit(options);
    const { latest } = await git.tags();

    const { newVersion } = getVersions('patch', latest);

    const generatedChangelog = await changelog.generate({
      tag: `${latest}..main`,
    });

    const branchName = `release/version-${newVersion}`;

    const actualChangelog = await readFile('./CHANGELOG.md', 'utf8');
    const newChangelog = generatedChangelog + actualChangelog;
    await writeFile('./CHANGELOG.md', newChangelog);

    await execPromisified(
      `yarn version --new-version ${newVersion} --no-git-tag-version`
    );

    const changeFiles = async () => {
      await writeFile('./CHANGELOG.md', newChangelog);
      await execPromisified(
        `yarn version --new-version ${newVersion} --no-git-tag-version`
      );

      return ['CHANGELOG.md', 'package.json'];
    };

    await createPullRequest({
      changeFiles,
      body: generatedChangelog,
      branchName,
      commitMessage: `release(version): ${newVersion}`,
      title: `release(version): ${newVersion}`,
      tag: {
        name: newVersion,
        message: `release(version): ${newVersion}`,
      },
    });

    await createRelease({
      title: newVersion,
      notes: generatedChangelog,
      tag: newVersion,
    });
  } catch (err) {
    console.log({ err });
  }
})();
