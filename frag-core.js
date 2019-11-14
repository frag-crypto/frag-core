const { createServer } = require('./server/server.js')
const build = require('./tooling/build.js')
// const defaultBuildConfig = require('./tooling/build.config.js')
// const loadPluginsFromDir = require('./server/loadPluginsFromDir.js')
const defaultConfig = require('./config/config.js')

// const defaultBuildTree = require('./config/default.build.options.js')
const generateBuildConfig = require('./tooling/generateBuildConfig.js')
module.exports = {
    createServer,
    build,
    // defaultBuildConfig,
    generateBuildConfig,
    // loadPluginsFromDir,
    defaultConfig
}
