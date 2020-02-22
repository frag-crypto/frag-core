const ServerFactory = require('./ServerFactory.js')

const createPrimaryRoutes = require('./routes/createPrimaryRoutes.js')
const createPluginRoutes = require('./routes/createPluginRoutes.js')

// const QORA_CONFIG = require("../config.js")
// const config = require('../config/load-config.js')

const createServer = (config, plugins) => {
    this.start = async function () {
        const primaryServer = new ServerFactory(createPrimaryRoutes(config, plugins), config.user.server.primary.host, config.user.server.primary.port, config.user.tls.enabled ? config.user.tls.options : void 0)
        primaryServer.startServer()
            .then(server => {
                console.log(`Primary server started at ${server.info.uri} and listening on ${server.info.address}`)
            })
            .catch(e => {
                console.error(e)
            })

        const pluginServer = new ServerFactory(createPluginRoutes(config, plugins), config.user.server.plugin.host, config.user.server.plugin.port, config.user.tls.enabled ? config.user.tls.options : void 0)
        pluginServer.startServer()
            .then(server => {
                console.log(`Plugin server started at ${server.info.uri} and listening on ${server.info.address}`)
            })
            .catch(e => {
                console.error(e)
            })
    }
    return this
}

// start()

const serverExports = {
    createServer
}

module.exports = serverExports
