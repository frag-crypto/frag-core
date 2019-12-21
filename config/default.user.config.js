const path = require('path')

const config = {
    node: {
        protocol: 'http',
        domain: '51.83.114.66',
        port: 62391,
        pingInterval: 10 * 60 * 1000
    },
    version: process.env.npm_package_version,
    // user: {
    //     language: 'english', // default...english
    //     theme: 'light' // maybe could become dark
    // },
    language: 'english', // default...english
    theme: 'light', // maybe could become dark
    server: {
        writeHosts: {
            enabled: true
        },
        relativeTo: path.join(__dirname, '../'),
        primary: {
            baseUrl: 'frag', // from coinConfig...hopefully useless
            domain: 'qor.tal',
            address: '127.0.0.1', // What the domain should point to
            port: 80, // Port to access the Qora UI from
            directory: './src/', // Core Qora-lite code.,
            page404: './src/404.html',
            host: '0.0.0.0' // This probably shouldn't be the default...
        },
        plugin: {
            domain: 'qor.tal', // '*.domain' is used to host subdomains
            address: '127.0.0.1',
            // domain: 'frag.ui'
            port: 80, // meh, why not keep it, who knows what kind of stuff people get into
            // port: 9087, // Disabled. Will now run on the same port as the host
            directory: './plugins', // Where the plugin folders are stored,
            default: 'wallet',
            host: '0.0.0.0' // frag.ui?
        }
    },
    // Might be better increased over a weaker or metered connection, or perhaps lowered when using a local node4
    tls: {
        enabled: false,
        options: {
            key: '',
            cert: ''
        }
    },
    constants: {
        pollingInterval: 3000, // How long between checking for new unconfirmed transactions and new blocks (in milliseconds).
        proxyURL: '/proxy/',
        workerURL: '/build/worker.js' // Probably be replaced with something in all the build config
    }
}

module.exports = config
