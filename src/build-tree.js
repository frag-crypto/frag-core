const path = require('path')

// All these paths are resolved BEFORE building. Rollup handles things for the client side.

// SRC_FOLDER = '' // Comes from config
// BUILD_FOLDER = '' // Comes from config

const apiComponents = {
    // All the do stuff imports...such as login(...) and logout()
    'api': {
        file: 'api/api.js',
        className: 'api'
    }
    // Need to split up the api/crypto and the wallet/wallet manager maybe?
    // ,
    // 'wallet': {

    // }
}

const styleTree = {
    '': {}
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

// This is the actual app structure. Each component is given access to itself I guess, after being loaded via dynamic import or systemjs
// Give every component an onLoaded method that is called once it's imported so that it can import it's own dependencies. Is passed it's children.
const componentTree = {
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

// So that the directory rollup is running in doesn't matter as the paths aren't relative
function addPathToSource (tree) {
    for (const component of Object.values(tree)) {
        // console.log(component)
        component.source = path.join(__dirname, component.file)
        if (component.children) {
            addPathToSource(component.children)
            // for (const child of Object.values(component.children)) {
            //     console.log(child)
            //     addPathToSource(child)
            // }
        }
    }
    return tree
}

addPathToSource(componentTree)
addPathToSource(functionalComponents)

module.exports = {
    componentTree,
    functionalComponents,
    apiComponents
}
