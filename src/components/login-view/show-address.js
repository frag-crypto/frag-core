import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'
import { Base58 } from '@frag-crypto/crypto'

import '@material/mwc-button'
import '@material/mwc-icon'

import FileSaver from 'file-saver'

class ShowAddress extends connect(store)(LitElement) {
    static get properties () {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextEnabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },
            wallet: { },
            user: { },
            pubicKey: { }
        }
    }

    constructor () {
        super()
        this.hideNav = true
        this.user = {
            accountInfo: {}
        }
        this.pubicKey = ''
    }

    updatePublicKey () {
        this.pubicKey = Base58.encode(this.wallet.addresses[0].keyPair.publicKey)
    }

    firstUpdate () {
        // ...
    }

    static get styles () {
        return [
            css`
                h3 {
                    font-family: 'Roboto', sans-serif;
                    font-weight: 100;
                }
                h4 {
                    font-family: 'Roboto Mono', monospace;
                    font-weight: 400;
                    padding: 12px 24px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
                span {
                    font-family: "Roboto mono", monospace;
                }
                [hidden] {
                    visibility: hidden;
                    display: none;
                }
            `
        ]
    }

    render () {
        return html`
            <div>
                <h3> Welcome to your Qortal account </h3>
                <br>
                <span>Address: </span>
                <h4>${this.wallet.addresses[0].address}</h4>
                <span>Public Key: </span>
                <h4>${Base58.encode(this.wallet.addresses[0].base58PublicKey)}</h4>
                <mwc-button @click=${() => this.download()} ?hidden=${!this.user.storedWallets[this.app.selectedAddress.address]}><mwc-icon>cloud_download</mwc-icon> &nbsp;Download backup</mwc-button>
                <br>
            </div>
        `
    }

    back () { }

    next () { }

    navigate (page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
        this.user = state.user
        this.app = state.app
        this.wallet = state.app.wallet
        if (state.app.wallet.addresses) console.log(state.app.wallet.addresses[0].address)
    }

    download () {
        const state = store.getState()
        const data = state.user.storedWallets[state.app.selectedAddress.address]
        // 'application/json' - omit...
        const dataString = JSON.stringify(data)
        // return download(dataString, 'karma_backup.json')
        console.log(dataString)
        // const zip = new JSZip()
        // zip.file(state.app.selectedAddress.address + '.json', dataString)

        // zip.generateAsync({ type: 'blob' })
        //     // .then(blob => FileSaver.saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.zip`))
        //     .then(blob => saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.zip`))
        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        // const blob = new Blob([dataString], { type: 'application/json' })
        FileSaver.saveAs(blob, `qortal_backup_${state.app.selectedAddress.address}.json`)
    }
}

window.customElements.define('show-address', ShowAddress)
