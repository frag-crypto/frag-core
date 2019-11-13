const { createServer } = require('./server/server.js')
const build = require('./tooling/build.js')
const defaultBuildConfig = require('./tooling/build.config.js')
// const loadPluginsFromDir = require('./server/loadPluginsFromDir.js')
const defaultConfig = require('./config/config.js')

module.exports = {
    createServer,
    build,
    defaultBuildConfig,
    // loadPluginsFromDir,
    defaultConfig
}
