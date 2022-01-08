const getVersions = require('./getNewVersion');
const childProcess = require('child_process');
const changelog = require('generate-changelog');
const simpleGit = require('simple-git/promise');
const util = require('util');
const fs = require('fs');

const execPromisified = util.promisify(childProcess.exec);
const spawnPromisified = util.promisify(childProcess.spawn);
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
    await git.pull('origin', 'main');
    await git.checkoutBranch(branchName, 'main');

    const actualChangelog = await readFile('./CHANGELOG.md', 'utf8');
    const newChangelog = generatedChangelog + actualChangelog;
    await writeFile('./CHANGELOG.md', newChangelog);

    await execPromisified(
      `yarn version --new-version ${newVersion} --no-git-tag-version`
    );

    await git.add(['package.json', 'CHANGELOG.md']);
    await git.commit(`release(version): ${newVersion}`);
    await git.push('origin', branchName);

    const { spawn } = childProcess;
    const gh = spawn('gh', [
      'pr',
      'create',
      '--title',
      `"release(version): ${newVersion}"`,
      '--body',
      generatedChangelog,
    ]);
    gh.stdout.on('data', () => gh.stdin.write('\n'));
  } catch (err) {
    console.log({ err });
  }
})();
