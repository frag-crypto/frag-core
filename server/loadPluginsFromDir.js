const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const readFile = util.promisify(fs.readFile)

/* Loads plugins from the supplied directory. Will return an array of plugin objects
[
    {
        folder: 'C://absolute/path/to/folder',
        name: 'folder' // Plugin will be served on http://folder.qor.tal or whatever the domain is
    }
]
*/
// pluginDir should be aboslute path
const loadPluginsFromDir = async pluginDir => {
    let listings = await readdir(pluginDir)
    listings = await Promise.all(listings.map(listing => stat(path.join(pluginDir, listing))
        .then(dirStats => dirStats.isDirectory() ? listing : false)
    ))
    let directories = listings.filter(listing => listing)

    directories = await Promise.all(directories.map(dir => {
        console.log(dir)
        return readFile(path.join(pluginDir, dir, '/main.js'))
            .then(file => {
                return {
                    folder: path.join(pluginDir, dir),
                    name: dir
                }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
                // return false
            })
    }))
    return directories.filter(dir => dir)
}

module.exports = loadPluginsFromDir
