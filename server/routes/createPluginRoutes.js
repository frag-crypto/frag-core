const path = require('path')
const createCommonRoutes = require('./createCommonRoutes.js')
// const config = require('../../config/config-loader.js')

const createPluginRoutes = config => {
    const routes = createCommonRoutes(config)

    routes.push(
        {
            method: 'GET',
            path: '/plugins/{path*}',
            handler: (request, h) => {
                // Change this to extracting the subdomain from request.info.host and using that rather than this /plugins/{*path} thing
                const filePath = path.join(__dirname, '../../', config.server.plugins.directory, request.params.path)
                console.log(filePath)
                const response = h.file(filePath)
                response.header('Access-Control-Allow-Origin', config.server.plugins.domain + ':' + config.server.plugins.port) // Should be
                return response
            }
        },
        {
            method: 'GET',
            path: '/plugins/404',
            handler: (request, h) => {
                return h.file(path.join(__dirname, '../../', config.server.primary.page404))
            }
        }
    )

    return routes
}

module.exports = createPluginRoutes
