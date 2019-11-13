// ./sites/cats.js
const createPluginRoutes = require('./routes/createPluginRoutes')

const createPluginServerFromConfig = config => {
    return {
        plugin: {
            name: 'plugin server',
            version: '0.0.0',
            register: async function (server, options) {
                // server.route({
                //     method: 'GET',
                //     path: '/',
                //     handler: (request, h) => {
                //         return 'Plugs'
                //     }
                // })
                server.route(createPluginRoutes(config))
            }
        }
    }
}

module.exports = createPluginServerFromConfig
