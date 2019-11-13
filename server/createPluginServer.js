// const createPluginServerPlugin = (server, plugins, routes) => {
//     for (const plugin of plugins) {

//     } 
// }
const plugin = {
    name: 'Plugin server',
    version: '0.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hello immmaaa plugin'
            }
        })
    }
}

module.exports = {
    plugin
}
