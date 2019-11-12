const Path = require('path')

const Hapi = require('hapi')
const Inert = require('inert') // For serving static files

const hostile = require('hostile')

const domain = 'new.server'
const address = '127.0.0.1'

const subdomains = ['test1', 'test2', 'punk']

const routes = {
    test1: 'test1.html',
    test2: 'test2.html'
}

const addSubDomain = subDomain => {
    const sourceDomain = !subDomain ? '' : subDomain + '.'
    console.log(sourceDomain + domain)
    hostile.set(address, sourceDomain + domain, function (err) {
        if (err) {
            console.error(err)
            setTimeout(() => { }, 500000)
        } else {
            console.log('set /etc/hosts successfully!')
        }
    })
    // Add it to the plugin server
}

subdomains.forEach(sd => addSubDomain(sd))
addSubDomain() // Adds the root domain

const server = new Hapi.Server({
    routes: {
        files: {
            relativeTo: Path.join(__dirname, './')
        }
    },
    address: '0.0.0.0',
    port: 80
})

const startServer = async () => {
    await server.register([
        Inert
    ])

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                console.log(request.info)
                console.log('=======================')
                console.log(request.info.host)
                const hostParts = request.info.host.split('.')
                console.log(hostParts)
                const hostPartsLength = hostParts.length
                let filePath = ''
                if (hostPartsLength > 2) {
                    console.log(hostParts[hostPartsLength - 3])
                    const file = routes[hostParts[hostPartsLength - 3]]
                    if (file) {
                        filePath = Path.join(__dirname, `/testFiles/${file}`)
                    } else {
                        filePath = Path.join(__dirname, '/testFiles/404.html')
                    }
                } else {
                    filePath = Path.join(__dirname, '/testFiles/index.html')
                }
                // console.log(hostParts[hostPartsLength - 1])
                // console.log(hostParts[hostPartsLength - 2])
                // console.log(hostParts[hostPartsLength - 3])
                
                console.log(filePath)
                const response = h.file(filePath)
                return response
            }
        }
    ])

    await server.start()

    console.log('Serving')
}

startServer()
