const simpleGit = require('simple-git/promise');
const childProcess = require('child_process');

module.exports = async ({
  changeFiles,
  branchName,
  commitMessage = 'feat(any): some changes',
  title = 'feat(any): some changes',
  body = '',
  tag,
}) => {
  if (typeof changeFiles !== 'function') {
    console.log('changeFiles must be a function');
    return;
  }

  if (!branchName) {
    console.log('branchName is required');
    return;
  }

  const options = {
    baseDir: process.cwd(),
  };
  const git = simpleGit(options);

  await git.pull('origin', 'main');
  await git.checkoutBranch(branchName, 'main');

  const filesChanged = (await changeFiles()) ?? [];
  await git.add(filesChanged);
  await git.commit(commitMessage);

  let pushArrayOptions = ['-u', 'origin', branchName];
  if (tag) {
    await git.addAnnotatedTag(tag.name, tag.message);
    pushArrayOptions = ['--follow-tags', ...pushArrayOptions];
  }
  await git.push(pushArrayOptions);

  const { spawn } = childProcess;
  const gh = spawn('gh', ['pr', 'create', '--title', title, '--body', body]);
  gh.stdout.on('data', () => gh.stdin.write('\n'));
};
