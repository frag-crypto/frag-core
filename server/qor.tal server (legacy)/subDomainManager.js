const hostile = require('hostile')

const config = require('../config/config-loader.js')
let domain = config.server.plugins.domain
let server = '127.0.0.1'

const subDomains = []

const setDomain = newDomain => {
    domain = newDomain
}

writeAllToHosts = () => {

}

const addSubDomain = subDomain => {
    hostile.set(server, subDomain + '.' + domain, function (err) {
        if (err) {
            console.error(err)
            setTimeout(() => { }, 500000)
        } else {
            console.log('set /etc/hosts successfully!')
        }
    })
    // Add it to the plugin server
}

module.exports = {
    setDomain
}