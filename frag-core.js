const server = require('./server/server.js')
const build = require('./tooling/build.js')
const defaultBuildConfig = require('./tooling/build.config.js')
const loadPluginsFromDir = require('./server/loadPluginsFromDir.js')

module.exports = {
    server,
    build,
    defaultBuildConfig,
    loadPluginsFromDir
}
