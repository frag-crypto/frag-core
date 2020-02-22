const { createServer } = require('./server/server.js')
const build = require('./tooling/build.js')
const watch = require('./tooling/watch.js')
const watchInlines = require('./tooling/watch-inlines.js')
// const defaultBuildConfig = require('./tooling/build.config.js')
// const loadPluginsFromDir = require('./server/loadPluginsFromDir.js')
const defaultConfig = require('./config/config.js')

// const electron = require('')

// const defaultBuildTree = require('./config/default.build.options.js')
const generateBuildConfig = require('./tooling/generateBuildConfig.js')
module.exports = {
    createServer,
    build,
    watch,
    watchInlines,
    // defaultBuildConfig,
    generateBuildConfig,
    // loadPluginsFromDir,
    defaultConfig
}
