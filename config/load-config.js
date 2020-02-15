let config = require('./config.js')
// let userConfig = {}
// try {
//     userConfig = require('./config.js')
// } catch (e) {
//     console.warn(e)
//     console.warn('Error loading user config')
// }

const checkKeys = (storeObj, newObj) => {
    for (const key in newObj) {
        if (!Object.prototype.hasOwnProperty.call(storeObj, key)) return
        // if (!storeObj.hasOwnProperty(key)) return

        if (typeof newObj[key] === 'object') {
            storeObj[key] = checkKeys(storeObj[key], newObj[key])
        } else {
            storeObj[key] = newObj[key]
        }
    }
    return storeObj
}

// config = checkKeys(config, userConfig)

const getConfig = customConfig => {
    config = checkKeys(config, customConfig)
    return config
}

module.exports = getConfig