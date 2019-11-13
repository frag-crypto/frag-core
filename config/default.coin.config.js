const coin = {
    name: 'Frag',
    symbol: 'FRG',
    addressCount: 1,
    addressVersion: 58, // Q for Qora
    decimals: 100000000,
    icon: './src/img/icon.png',
}

const crypto = {
    kdfThreads: 16,
    staticSalt: '4ghkVQExoneGqZqHTMMhhFfxXsVg2A75QeS1HCM5KAih', // Base58 encoded
    bcryptRounds: 11, // Note it's kinda bcryptRounds * log.2.16, cause it runs on all 16 threads
    bcryptVersion: '2a',
    get staticBcryptSalt () {
        return `$${this.bcryptVersion}$${this.bcryptRounds}$IxVE941tXVUD4cW0TNVm.O`
    }
}

module.exports = {
    crypto,
    coin
}
