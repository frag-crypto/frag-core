// ./sites/cats.js
const createPluginRoutes = require('./routes/createPluginRoutes')

const createPluginServerFromConfig = (config, plugins) => {
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
                server.route(createPluginRoutes(config, plugins)) // Annoying to to be passing it down... guess i'll change this later
            }
        }
    }
}

module.exports = createPluginServerFromConfig
