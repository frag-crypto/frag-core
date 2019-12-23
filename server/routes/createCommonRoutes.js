// const config = require('../../config/config-loader.js')
const path = require('path')
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
    // {
    //     method: 'GET',
    //     path: '/img/{param*}',
    //     handler: {
    //         directory: {
    //             path: './img',
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
                // path: path.join(__dirname, '../../build'),
                path: config.build.options.imgDir,
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/webcomponentsjs/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/'),
                redirectToSlash: true,
                index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/bluebird/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../node_modules/bluebird/'), redirectToSlash: true, index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/whatwg-fetch/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../node_modules/whatwg-fetch/'), redirectToSlash: true, index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/systemjs/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../node_modules/systemjs/'), redirectToSlash: true, index: true
            }
        }
    },
    {
        method: 'GET',
        path: '/font/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../../font'),
                // path: config.build.options.fontDir,
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
                config: {
                    ...config
                }
            }
            delete response.config.user.tls // VERY IMPORTANT
            delete response.config.build // meh
            return JSON.stringify(response)
        }
    }
]

module.exports = createRoutes
