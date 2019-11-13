// ./sites/cats.js
const createPrimaryRoutes = require('./routes/createPrimaryRoutes.js')

const createPrimaryServerFromConfig = config => {
    return {
        plugin: {
            name: 'primary',
            version: '0.0.0',
            register: async function (server, options) {
                // server.route({
                //     method: 'GET',
                //     path: '/',
                //     handler: (request, h) => {
                //         return 'Prims'
                //     }
                // })
                const routes = createPrimaryRoutes(config)
                console.log('routes: ', routes)
                server.route(routes)
            }
        }
    }
}

module.exports = createPrimaryServerFromConfig