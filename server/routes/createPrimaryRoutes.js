const path = require('path')

const createCommonRoutes = require('./createCommonRoutes.js')
// const routes = require('./commonRoutes.js')
// const getPluginDirs = require('../getPluginDirs.js')
// const getAirdrop = require('./getAirdrop.js')
// const checkName = require('./checkName.js')
// const saveEmail = require('./saveEmail.js') // Nah fam we decentralized
// const config = require('../../config/config-loader.js')

const createPrimaryRoutes = config => {
    const routes = createCommonRoutes(config)

    routes.push(
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                console.log(request.params)
                return h.redirect(`/${config.coin.baseUrl}/wallet`) // Should be /config.defaultPlugin or something like that...
            }
        },
        {
            method: 'GET',
            path: `/${config.coin.baseUrl}/{path*}`,
            handler: {
                file: path.join(__dirname, '../../public/index.html')
                // file: path.join(__dirname, "../../build/src/index.html") // Production
            }
        },
        {
            method: 'GET',
            path: '/favicon.ico',
            handler: {
                file: path.join(__dirname, '../../favicon.ico')
                // file: path.join(__dirname, "../../build/src/index.html") // Production
            }
        },
        {
            method: 'GET',
            path: '/getPlugins',
            handler: (request, h) => {
                // pluginLoader.loadPlugins()
                return getPluginDirs().then(dirs => {
                    return { plugins: dirs }
                }).catch(e => console.error(e))
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
