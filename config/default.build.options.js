const path = require('path')

const { makeSourceAbsolute } = require('../tooling/utils.js')
const srcDir = '../src'
// All these paths are resolved BEFORE building. Rollup handles things for the client side.

// SRC_FOLDER = '' // Comes from config
// BUILD_FOLDER = '' // Comes from config

// Could be used to overwrite absolutely anything
const options = {
    inputFile: path.join(__dirname, '../src/main.js'),
    outputDir: path.join(__dirname, '../build'),
    sassOutputDir: path.join(__dirname, '../build/styles.bundle.css'),
    imgDir: path.join(__dirname, '../img')
}

const aliases = {
    '@frag-crypto/crypto': 'node_modules/frag-qora-crypto/api.js'
    // '@frag/crypto': path.join(__dirname, '../node_modules/frag-qora-crypto/')
}

const apiComponents = {
    // All the do stuff imports...such as login(...) and logout()
    api: {
        file: 'api/api.js',
        className: 'api'
    }
    // Need to split up the api/crypto and the wallet/wallet manager maybe?
    // ,
    // 'wallet': {

    // }
}

// No idea what this was for...
const styleTree = {
    styles: {
        file: 'styles/styles.scss'
    }
}

// There are imports which append themselves to the dom and export that specific instance. There are purely meant to be used as an api, rather than as a component
const functionalComponents = {
    'loading-ripple': {
        file: 'functional-components/loading-ripple.js',
        className: 'LoadingRipple'// Maybe don't want class names....rather exported function or object? More likely to be an exported instance of the class.
    },
    // 'toast': {
    //     file: 'components/toast.js',
    //     className: 'Toast'
    // },
    'confirm-transaction-dialog': {
        file: 'functional-components/confirm-transaction-dialog',
        className: 'ConfirmTransactionDialog'
    }
}

// Inlines all dependencies... transpiles to es5
const inlineComponents = [
    {
        className: 'worker',
        input: path.join(__dirname, srcDir, 'worker.js'),
        output: 'worker.js' // relative to outputDir
    },
    {
        className: 'PluginMainJSLoader',
        input: path.join(__dirname, srcDir, '/plugins/plugin-mainjs-loader.js'),
        output: 'plugins/plugin-mainjs-loader.js' // relative to outputDir
    }
]

// This is the actual app structure. Each component is given access to itself I guess, after being loaded via dynamic import or systemjs
// Give every component an onLoaded method that is called once it's imported so that it can import it's own dependencies. Is passed it's children.
const elementComponents = {
    // This should be in the frag-qora-crypto thing
    'main-app': {
        file: 'components/main-app.js',
        className: 'MainApp',
        children: {
            'app-styles': {
                file: 'styles/app-styles.js',
                className: 'AppStyles',
                children: {
                    'app-theme': {
                        className: 'AppTheme',
                        file: 'styles/app-theme.js'
                    }
                }
            },
            'app-view': {
                file: 'components/app-view.js',
                className: 'AppView',
                children: {
                    'show-plugin': {
                        file: 'components/show-plugin.js',
                        className: 'ShowPlugin'
                    },
                    'sidenav-menu': {
                        file: 'components/sidenav-menu.js',
                        className: 'SidenavMenu'
                    },
                    'wallet-profile': {
                        file: 'components/wallet-profile.js',
                        className: 'WalletProfile'
                    }
                }
            },
            'login-view': {
                file: 'components/login-view/login-view.js',
                className: 'LoginView',
                children: {
                    'create-account-section': {
                        file: 'components/login-view/create-account-section.js',
                        className: 'CreateAccountSection'
                    },
                    'login-section': {
                        file: 'components/login-view/login-section.js',
                        className: 'LoginSection'
                    }
                }
            }
            // ,
            // 'confirm-transaction-dialog': {} // Perhaps should be more like the login loading ripple? Add itself to the dom and exports a reference. Mmm
        }
    }
    // confirm-transaction-dialog and loading-ripple goes here? Split up the element and the api? Nah, the element is the api
}

// import './create-account-section.js'
// import './login-section.js'

makeSourceAbsolute(path.join(__dirname, srcDir), elementComponents)
makeSourceAbsolute(path.join(__dirname, srcDir), functionalComponents)

module.exports = {
    options,
    elementComponents,
    functionalComponents,
    inlineComponents,
    apiComponents,
    aliases
}
