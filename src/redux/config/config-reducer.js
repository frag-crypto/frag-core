// Must be saved to localstorage. Will storage things such as saved addresses and themes (day/night mode) etc.
// Initial state needs to be loaded from either the getConfig url or localstorage...NOT set via this
import { loadStateFromLocalStorage } from '../../localStorageHelpers'
import { LOAD_CONFIG_FROM_API, SET_NODE, ADD_NODE } from './config-actions.js'
// import { loadConfigFromAPI } from './loadConfigFromAPI.js'
// Import case reducers
// import { loadConfigFromAPI } from './loadConfigFromAPI.js'
import { loadConfigFromAPI } from './reducers/load-config-from-api.js'
import { setNode, addNode } from './reducers/manage-node.js'

const DEFAULT_INITIAL_STATE = {
    styles: {
        theme: {
            color: 'green', // Not sure this is a thing,
            colors: {}
        }
    },
    coin: {
        name: ''
    },
    // server: {},
    user: {
        // Wrong place I think...?
        language: 'english',
        theme: 'light',
        // This should probably move? Or maybe not.
        server: {},
        node: 0,
        knownNodes: [{}]
    },
    savedWallets: {},
    loaded: false
}

export default (state = loadStateFromLocalStorage('config') || DEFAULT_INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_CONFIG_FROM_API:
            return loadConfigFromAPI(state, action)
        case SET_NODE:
            return setNode(state, action)
        case ADD_NODE:
            return addNode(state, action)
        default:
            return state
    }
}
