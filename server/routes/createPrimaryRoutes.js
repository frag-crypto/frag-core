const path = require('path')

const createCommonRoutes = require('./createCommonRoutes.js')
// const routes = require('./commonRoutes.js')
// const getPluginDirs = require('../getPluginDirs.js')
// const getAirdrop = require('./getAirdrop.js')
// const checkName = require('./checkName.js')
// const saveEmail = require('./saveEmail.js') // Nah fam we decentralized
// const config = require('../../config/config-loader.js')

const createPrimaryRoutes = (config, plugins) => {
    const routes = createCommonRoutes(config)
    console.log(config.build.options.outputDir)
    routes.push(
        {
            method: 'GET',
            path: '/{path*}',
            handler: {
                file: {
                    path: path.join(__dirname, '../../public/index.html'),
                    confine: false
                }
                // file: path.join(__dirname, "../../build/src/index.html") // Production...maybe
            }
        },
        {
            method: 'GET',
            path: '/favicon.ico',
            handler: {
                file: {
                    path: path.join(__dirname, '../../favicon.ico'),
                    confine: false
                }
                // file: path.join(__dirname, "../../build/src/index.html") // Production
            }
        },
        {
            method: 'GET',
            path: '/getPlugins',
            handler: (request, h) => {
                // pluginLoader.loadPlugins()
                console.log(plugins)
                return { plugins: plugins.map(p => p.name) }
            }
        },
        {
            method: 'GET',
            path: '/build/{param*}',
            handler: {
                directory: {
                    // path: path.join(__dirname, '../../build'),
                    path: config.build.options.outputDir,
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        {
            method: 'GET',
            path: '/src/{param*}',
            handler: {
                directory: {
                    // path: path.join(__dirname, '../../build'),
                    path: path.join(__dirname, '../../src'),
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        {
            method: '*',
            path: '/proxy/{url*}',
            handler: {
                proxy: {
                    mapUri: (request) => {
                        // console.log(request)
                        // http://127.0.0.1:3000/proxy/explorer/addr=Qewuihwefuiehwfiuwe
                        // protocol :// path:port / blockexplorer.json?addr=Qwqfdweqfdwefwef
                        // const url = request.url.href.slice(7)// Chop out "/proxy/"
                        const url = request.url.pathname.slice(7) + request.url.search// Chop out "/proxy/"
                        if (url.includes('/admin/') && !config.user.enableManagement) return { uri: '' }
                        // let url = remote.url + "/" + request.url.href.replace('/' + remote.path + '/', '')
                        // console.log(url)
                        // console.log(request)
                        return {
                            uri: url
                        }
                    },
                    passThrough: true,
                    xforward: true
                }
            }
        })

    return routes
}

module.exports = createPrimaryRoutes
