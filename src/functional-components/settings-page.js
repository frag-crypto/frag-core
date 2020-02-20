import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

import { doSetNode } from '../redux/config/config-actions.js'

import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-textfield'
import '@material/mwc-icon'

import '@material/mwc-list/mwc-list-item.js'
// import '@material/mwc-list/mwc-list.js'

let settingsDialog

class SettingsPage extends connect(store)(LitElement) {
    static get properties () {
        return {
            lastSelected: { type: Number }
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

            <mwc-dialog id="settingsDialog" heading="Settings" opened=false>
                <div style="min-height:240px;">
                    <!-- <mwc-list>
                        <mwc-list-item>Thing 1</mwc-list-item>
                    </mwc-list> -->

                    <mwc-select id="nodeSelect" label="Node url" index="0" @selected=${(e) => this.nodeSelected(e)} style="min-width: 130px; max-width:100%; width:100%;">
                        ${this.config.user.knownNodes.map((n, index) => html`
                            <mwc-list-item value="${index}">${n.protocol + '://' + n.domain + ':' + n.port}</mwc-list-item>
                        `)}
                        <!-- <mwc-list-item value="add" @click=${() => console.log('meh')}><mwc-icon>add</mwc-icon> Add node</mwc-list-item> -->
                    </mwc-select>

                </div>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="close">
                    Close
                </mwc-button>
            </mwc-dialog>
            
            <mwc-dialog id="addNodeDialog" heading="Add node">
                <mwc-select label="Protocol" style="width:100%;">
                    <mwc-list-item value="http">http</mwc-list-item>
                    <mwc-list-item value="https">https</mwc-list-item>
                </mwc-select>
                <br>
                <mwc-textfield style="width:100%;" label="Domain"></mwc-textfield>
                <mwc-textfield style="width:100%;" label="Port"></mwc-textfield>
                <mwc-button
                    slot="secondaryAction"
                    dialogAction="close">
                    Cancel
                </mwc-button>
                <mwc-button
                    slot="primaryAction"
                    dialogAction="close">
                    Add
                </mwc-button>
            </mwc-dialog>
        `
    }

    stateChanged (state) {
        this.config = state.config
    }

    show () {
        this.shadowRoot.getElementById('settingsDialog').show()
    }

    nodeSelected (e) {
        console.log('Node selected', e)
        const selectedNode = this.shadowRoot.getElementById('nodeSelect').value
        if (selectedNode === 'add') {
            // open add node dialog
            this.shadowRoot.getElementById('addNodeDialog').show()
        }
        const index = parseInt(selectedNode)
        if (isNaN(index)) return

        // Set selected node
    }

    addNode () {

    }
}

window.customElements.define('settings-page', SettingsPage)

const settings = document.createElement('settings-page')
settingsDialog = document.body.appendChild(settings)

export default settingsDialog
