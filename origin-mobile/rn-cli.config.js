const projectRoot = __dirname;
const metroConfig = require('react-native-monorepo-helper').default;

module.exports = metroConfig(projectRoot)
;const extraNodeModules = require('node-libs-browser');

module.exports = {
  extraNodeModules,
};
