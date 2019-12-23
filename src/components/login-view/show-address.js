import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

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
            user: { }
        }
    }

    constructor () {
        super()
        this.hideNav = true
        this.user = {
            accountInfo: {}
        }
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
                <h4>${this.wallet.addresses[0].address}</h4>
                <mwc-button @click=${() => this.download()} ?hidden=${!this.user.storedWallets[this.app.selectedAddress.address]}><mwc-icon>cloud_download</mwc-icon> &nbsp;Download backup</mwc-button>
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
        console.log('PRRRR')
        console.log(state.app.wallet)
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
