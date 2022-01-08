const getVersions = require('./getNewVersion');
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

    const actualChangelog = await readFile('./CHANGELOG.md', 'utf8');
    const newChangelog = generatedChangelog + actualChangelog;
    await writeFile('./CHANGELOG.md', newChangelog);

    await git.checkoutBranch(`release-${newVersion}`);
    await execPromisified(
      `yarn version --new-version ${newVersion} --no-git-tag-version`
    );

    await git.add(['package.json', 'CHANGELOG.md']);
    await git.commit(`release(version): ${newVersion}`);

    await execPromisified(
      `gh pr create --title "release(version): ${newVersion}"`
    );
  } catch (err) {
    console.log({ err });
  }
})();
