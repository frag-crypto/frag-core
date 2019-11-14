const path = require('path')

const platform = require('os').platform()

// const Hapi = require('hapi') Use Glue instead to create the Hapi server
const Glue = require('@hapi/glue') // Hapi composer

const Inert = require('inert') // For serving static files
const h2o2 = require('h2o2') // Proxy

const hostile = require('hostile')

const createPrimaryServerFromConfig = require('./primaryServer.js')
const createPluginServerFromConfig = require('./pluginServer.js')

// const defaultConfig = require('../config/config.js')
// const serverConf = defaultConfig.user.server

// const plugins = ['plugin1', 'punk', 'plugin2', 'test1']

// Check for admin on windows...
const checkAdmin = () => {
    if (platform === 'win32' || platform === 'win64') {
        require('child_process').exec('net session', function (err, stdout, stderr) {
            if (err || !(stdout.indexOf('There are no entries in the list.') > -1)) {
                console.log('')
                throw new Error('Cannot set hosts as you are not running as admin')
                return false
            } else {
                console.log('This is being ran with administrator privileges!')
                return true
            }
        })
    } else {
        console.log('Unknown')
    }
}

const setDNS = (target, domain, subdomain) => {
    subdomain = subdomain ? subdomain + '.' : ''
    return new Promise((resolve, reject) => {
        hostile.set(target, subdomain + domain, function (err) {
            if (err) {
                console.error(err)
                // reject(err) Probably could or should but meh
            } else {
                console.log(`set /etc/hosts successfully for ${subdomain}${domain}!`)
            }
            resolve()
        })
    })
}

const createServer = (config, plugins) => {
    const serverConf = config.user.server

    // Set DNS for plugins if it's enabled
    if (serverConf.writeHosts.enabled) {
        setDNS(serverConf.plugin.address, serverConf.plugin.domain) // No subdomain specified so sets DNS for the root domain
        plugins.forEach(plugin => setDNS(serverConf.plugin.address, serverConf.plugin.domain, plugin.name))
    }

    const manifest = {
        server: {
            host: process.env.HOST || config.user.server.primary.host,
            port: process.env.PORT || config.user.server.primary.port
        },
        register: {
            plugins: [
                Inert,
                h2o2,
                {
                    // plugin: './primaryServer',
                    plugin: createPrimaryServerFromConfig(config, plugins),
                    routes: {
                        vhost: config.user.server.primary.domain
                    }
                },
                {
                    // plugin: './pluginServer',
                    plugin: createPluginServerFromConfig(config, plugins),
                    routes: {
                        // vhost: '*.' + defaultConfig.user.server.plugin.domain // Guess we gone need to make an array of subdomains...
                        vhost: plugins.map(plugin => plugin.name + '.' + serverConf.plugin.domain)
                    }
                }
            ]
        }
    }
    const options = {
        relativeTo: serverConf.relativeTo
    }
    console.log(options)
    // Glue is async because it includes the server.register part (which is async)
    this.start = async function () {
        try {
            this.server = await Glue.compose(manifest, options)
            await this.server.start()
            console.log('Yeet!')
            console.log(`Plugin server started at ${this.server.info.uri} and listening on ${this.server.info.address}`)
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }

    return this
}

module.exports = {
    createServer
}

// const hostSplit = (request, h, routes) => {
//     // routes = { plugin: ..., root: ..., specificPlugin: {subdomain: '', func: () => {...} }}
//     const host = request.info.host
//     const subdomain = host.replace(domain, '')
//     if (subdomain !== '') {
//         if (routes.plugin) {
//             return routes.plugin(request, h)
//         }
//         if (routes.specificPlugin) {
//             filePath = Path.join(__dirname, '/testFiles/404.html')
//         }
//     } else {
//         filePath = Path.join(__dirname, '/testFiles/index.html')
//     }
// }

// const createServer = (config, plugins) => {

//     const server = new Hapi.Server({
//         routes: {
//             files: {
//                 relativeTo: Path.join(__dirname, './')
//             }
//         },
//         address: '0.0.0.0',
//         port: 80
//     })

//     server.route([
//         {
//             method: 'GET',
//             path: '/',
//             handler: (request, h) => {
//                 const hostParts = request.info.host.split('.')
//                 console.log(hostParts)
//                 const hostPartsLength = hostParts.length
//                 let filePath = ''
//                 if (hostPartsLength > 2) {
//                     console.log(hostParts[hostPartsLength - 3])
//                     const file = routes[hostParts[hostPartsLength - 3]]
//                     if (file) {
//                         filePath = Path.join(__dirname, `/testFiles/${file}`)
//                     } else {
//                         filePath = Path.join(__dirname, '/testFiles/404.html')
//                     }
//                 } else {
//                     filePath = Path.join(__dirname, '/testFiles/index.html')
//                 }
//                 // console.log(hostParts[hostPartsLength - 1])
//                 // console.log(hostParts[hostPartsLength - 2])
//                 // console.log(hostParts[hostPartsLength - 3])

//                 console.log(filePath)
//                 const response = h.file(filePath)
//                 return response
//             }
//         }
//     ])

//     return server
// }

// module.exports = {
//     createServer
// }
