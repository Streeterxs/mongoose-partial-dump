const semver = require('semver');
const pkg = require('../../package.json');

module.exports = (ver, latestVersion) => {
  const currentVersion = latestVersion ?? pkg.version;
  return {
    currentVersion,
    newVersion: semver.inc(currentVersion, ver),
  };
};
