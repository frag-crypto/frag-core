// const config = require('../../config/config-loader.js')

const createRoutes = config => [
    // Nope why would we need?
    // {
    //     method: 'GET',
    //     path: '/src/{param*}',
    //     handler: {
    //         directory: {
    //             path: './src',
    //             redirectToSlash: true,
    //             index: true
    //         }
    //     }
    // },
    {
        method: 'GET',
        path: '/img/{param*}',
        handler: {
            directory: {
                path: './img',
                redirectToSlash: true,
                index: true
            }
        }
    },
    // Don't need...I think and hope. More secure if untrusted code isn't loaded over our origins
    // {
    //     method: 'GET',
    //     path: '/node_modules/{param*}',
    //     handler: {
    //         directory: {
    //             path: './node_modules',
    //             redirectToSlash: true,
    //             index: true
    //         }
    //     }
    // },
    {
        method: 'GET',
        path: '/getConfig',
        handler: (request, h) => {
            const response = {
                config
            }
            delete response.config.tls
            return JSON.stringify(response)
        }
    }
]

module.exports = createRoutes
