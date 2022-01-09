const childProcess = require('child_process');

module.exports = async ({
  title = 'feat(any): some changes',
  notes = '',
  tag,
}) => {
  const { spawn } = childProcess;
  const gh = spawn('gh', [
    'release',
    'create',
    tag,
    '--title',
    title,
    '--notes',
    notes,
  ]);
  gh.stdout.on('data', () => gh.stdin.write('\n'));
};
