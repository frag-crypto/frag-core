import { store } from '../store.js'
import { doAddPluginUrl } from '../redux/app/app-actions.js'
// import * as api from '../qora/api.js'
// import * as api from '../api/api.js'
import * as api from '@frag/crypto'
import { requestTransactionDialog } from '../functional-components/confirm-transaction-dialog.js'

const createTransaction = api.createTransaction
const processTransaction = api.processTransaction
// import { createTransaction } from '../api/createTransaction.js'
// import { createTransaction } from '@frag/crypto'

export const routes = {
    hello: async req => {
        return 'Hello from awesomeness'
    },

    pluginsLoaded: async req => {
        // Hmmm... not sure what this one does
    },

    registerUrl: async req => {
        // console.log('REGISTER URL REQUEST YASSSSS', req)
        const { url, title, menus, icon, domain, page, parent = false } = req.data
        store.dispatch(doAddPluginUrl({
            url,
            domain,
            title,
            menus,
            icon,
            page,
            parent
        }))
    },

    registerTopMenuModal: async req => {
        // const { icon, frameUrl, text } = req
        // Leave as not implemented for now, don't need cause we are using a normal page for send money...better on mobile
    },

    addMenuItem: async req => {
        // I assume this is...idk
    },

    apiCall: async req => {
        // console.log(req.data)
        // console.log(api.request)
        // console.log(req)
        const url = req.data.url
        delete req.data.url
        return api.request(url, req.data)
    },

    addresses: async req => {
        return store.getState().app.wallet.addresses.map(address => {
            return {
                address: address.address,
                color: address.color,
                nonce: address.nonce,
                textColor: address.textColor,
                base58PublicKey: address.base58PublicKey
            }
        })
    },

    // Singular
    address: async req => {
        // nvm
    },

    transaction: async req => {
        // One moment please...this requires templates in the transaction classes
        let response
        try {
            // const txBytes = createTransaction(req.data.type, store.getState().app.wallet._addresses[req.data.nonce].keyPair, req.data.params)
            const tx = createTransaction(req.data.type, store.getState().app.wallet._addresses[req.data.nonce].keyPair, req.data.params)
            console.log(api, tx, tx.signedBytes)
            // await requestTransactionDialog.requestTransaction(tx)
            const res = await processTransaction(tx.signedBytes)
            console.log(res)
            response = {
                success: true,
                data: res
            }
        } catch (e) {
            console.error(e)
            console.error(e.message)
            response = {
                success: false,
                message: e.message
            }
        }
        return response
    },

    username: async req => {
        const state = store.getState()
        console.log(state.app.wallet.addresses[0].address, state.user.storedWallets)
        const username = state.user.storedWallets[state.app.wallet.addresses[0].address].name
        console.log(username)
        return username
    }
}
