const coin = require('./default.coin.config.js')
const crypto = require('./default.crypto.config.js')
const user = require('./default.user.config.js')
const styles = require('./default.styles.config.js')
const build = require('./default.build.options')

console.log(styles)

module.exports = { coin, crypto, user, styles, build }
