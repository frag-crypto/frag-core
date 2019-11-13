// ./sites/cats.js
module.exports.plugin = {
    name: 'plugin server',
    version: '0.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Plugs'
            }
        })
    }
}