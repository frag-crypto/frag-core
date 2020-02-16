import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import '@material/mwc-dialog'
import '@material/mwc-button'

let settingsDialog

class SettingsPage extends connect(store)(LitElement) {
    static get properties () {
        return {
            txInfo: { type: Object }
        }
    }

    static get styles () {
        return css`
            
        `
    }

    render () {
        return html`
            <style>
                
            </style>

            <mwc-dialog id="settings" heading="Settings" opened=false>
                <div>
                    Prrr
                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="close">
                    Close
                </mwc-button>
            </mwc-dialog>
        `
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
    }

    show () {
        this.shadowRoot.getElementById('settings').show()
    }
}

window.customElements.define('settings-page', SettingsPage)

const settings = document.createElement('settings-page')
settingsDialog = document.body.appendChild(settings)

export default settingsDialog
