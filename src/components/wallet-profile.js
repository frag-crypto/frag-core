import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
// import download from '../api/deps/download.js'
// import JSZip from 'jszip'
// import saveAs from 'file-saver/src/FileSaver.js'
import FileSaver from 'file-saver'
import { UPDATE_NAME_STATUSES } from '../redux/user/user-actions.js'

// import '@material/mwc-icon'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/iron-icons/iron-icons.js'
// import '@polymer/paper-dialog'
import '@polymer/paper-toast'
import '@polymer/paper-spinner/paper-spinner-lite'

import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon-button'
import '@material/mwc-textfield'

class WalletProfile extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: Boolean },
            config: { type: Object },
            user: { type: Object },
            wallet: { type: Object },
            dialog: { type: Object },
            newName: { type: String }
        }
    }

    static get styles () {
        return [
            css`
                
            `
        ]
    }

    constructor () {
        super()
        this.user = {
            accountInfo: {}
        }
    }

    render () {
        return html`
            <style>
                #profileInMenu {
                    padding:12px;
                    border-bottom: 1px solid #eee;
                }
                #profileInMenu:hover {
                    /* cursor:pointer; */
                }
                #accountIcon {
                    font-size:48px;
                    color: var(--mdc-theme-primary);
                    display: inline-block;
                }
                #accountName {
                    margin: 0;
                    font-size: 18px;
                    font-weight:100;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                    ${this.user.accountInfo.nameStatus !== UPDATE_NAME_STATUSES.LOADED ? 'font-style: italic;' : ''}
                }
                #address {
                    white-space: nowrap; 
                    overflow: hidden;
                    text-overflow: ellipsis;

                    margin:0;
                    margin-top: -6px;
                    font-size:12px;
                    /* padding-top:8px; */
                }
                paper-spinner-lite#name-spinner {
                    top: 8px;
                    margin-left:8px;
                    --paper-spinner-stroke-width: 1px;
                    --paper-spinner-color: var(--mdc-theme-secondary) /* Shouldn't have to do this :( */
                }
            </style>


            <div id="profileInMenu">
                <!-- <paper-ripple></paper-ripple> -->
                <div>
                    <mwc-icon id='accountIcon'>account_circle</mwc-icon>
                </div>
                <div style="padding: 8px 0;">
                    <span id="accountName"
                        title=${this.user.accountInfo.nameStatus !== UPDATE_NAME_STATUSES.LOADED ? 'You are not minting' : 'Minting'}
                    >
                        <!-- No name set  -->
                        ${this.user.accountInfo.name}
                        <!-- <mwc-icon style="float:right; top: -10px;">keyboard_arrow_down</mwc-icon> -->
                        <mwc-icon-button 
                            style="float:right; top: 0px;"
                            @click=${() => this.dialog.show()}
                            icon="info"></mwc-icon-button>
                        <!-- <paper-icon-button
                            
                            style="float:right; top: 0px;"
                            icon="icons:info"></paper-icon-button> -->
                    </span>
                    <p id="address">${this.wallet.addresses[0].address}</p>
                </div>
            </div>

            <mwc-dialog id="setNameDialog">
                <h1 style="font-size: 24px; padding-top: 6px;">Set name</h1>

                <p style="margin-bottom:0;">
                    Note that this can only ever be done <strong>once</strong>. Name can contain any utf-8 character, however letters will
                    be converted to lowercase.
                </p>
                <paper-input @input=${e => { this.newName = e.target.value }} style="margin-top:0;" label="Name" type="text"></paper-input>

                <mwc-button slot="primaryAction" class="confirm" @click=${() => this._setName()}>Go</mwc-button>
                <mwc-button slot="secondaryAction" dialogAction="close" class="red-button">Cancel</mwc-button>
            </mwc-dialog>

            <div id="dialogs">
                <style>
                    /* Dialog styles */
                    #dialogAccountIcon {
                        font-size:76px;
                        color: var(--mdc-theme-primary);
                    }

                    h1 {
                        font-weight: 100;
                    }

                    span {
                        font-size: 18px;
                        word-break: break-all;
                    }
                    .title {
                        font-weight:600;
                        font-size:12px;
                        line-height: 32px;
                        opacity: 0.66;
                    }
                    #profileList {
                        padding:0;
                    }
                    #profileList > * {
                        /* padding-left:24px;
                        padding-right:24px; */
                    }
                    #nameDiv:hover, #backupDiv:hover {
                        cursor: pointer;
                    }
                    .red-button {
                        /* --mdc-theme-on-primary: var(--mdc-theme-error); */
                        --mdc-theme-primary: var(--mdc-theme-error);
                    }
                </style>
                <mwc-dialog id="profileDialog">
                    <div>
                    <!-- Gets moved to documnet.body so we need to put styles here -->
                        <div style="text-align:center">
                            <mwc-icon id="dialogAccountIcon">account_circle</mwc-icon>
                            <h1>Profile</h1>
                            <hr>
                        </div>
                        <div id="profileList">
                            <span class="title">Address</span>
                            <br>
                            <div><span class="">${this.wallet.addresses[0].address}</span></div>
                            ${true ? html`
                                <span class="title">Qora address</span>
                                <br>
                                <div><span class="">Qabcdefghijklmnop</span></div>
                                <span class="title">Burned Qora amount</span>
                                <br>
                                <div><span class="">17 000</span></div>
                            ` : ''}
                            <span class="title">Public key</span>
                            <br>
                            <div><span class="">${this.wallet.addresses[0].base58PublicKey}</span></div>
                            <div id="backupDiv" style="position:relative;" @click=${() => this.dialogContainer.getElementById('downloadBackupPasswordDialog').show()}>
                                <span class="title">Backup</span>
                                <br>
                                <span class="">Download wallet backup <mwc-icon style="float:right; margin-top:-2px; width:24px; overflow:hidden;">cloud_download</mwc-icon></span>
                                <paper-ripple></paper-ripple>
                                <br>
                            </div>
                        </div>
                    </div>
                    <mwc-button slot="primaryAction" dialogAction="close">Close</mwc-button>
                </mwc-dialog>

                <mwc-dialog id="downloadBackupPasswordDialog" heading="Backup password">
                    <p>
                        Please choose a password to encrypt your backup with (this can be the same as the one you logged in with, or different)
                    </p>
                    <mwc-textfield style="width:100%;" icon="vpn_key" id="downloadBackupPassword" label="Password"></mwc-textfield>
                    <mwc-button slot="primaryAction" class="confirm" @click=${() => this.downloadBackup()}>Go</mwc-button>
                    <mwc-button slot="secondaryAction" dialogAction="close" class="red-button">Close</mwc-button>
                <mwc-dialog>

            </div>

            <paper-toast id="toast" horizontal-align="right" vertical-align="top" vertical-offset="64"></paper-toast>

        `
    }

    openSetName () {
        if (this.name) return
        if (this.setNameInProgress) return
        this.setNameDialog.show()
    }

    _setName () {
        this.setNameDialog.close()
        this.dialog.close()
        this.toast.text = 'Name has been set. It may take a few minutes to show.'
        this.toast.duration = 6000
        this.toast.show()
        this.setNameInProgress = true
        setTimeout(() => {
            this.setNameInProgress = false
        }, 5 * 60 * 1000) // 5 minutes
    }

    firstUpdated () {
        const container = document.body.querySelector('main-app').shadowRoot.querySelector('app-view').shadowRoot
        const dialogs = this.shadowRoot.getElementById('dialogs')
        this.dialogContainer = container
        container.appendChild(dialogs)
        console.log(container)
        // const setNameDialog = this.shadowRoot.getElementById('setNameDialog')
        this.dialog = container.getElementById('profileDialog')
        this.setNameDialog = container.getElementById('setNameDialog')

        const toast = this.shadowRoot.getElementById('toast')
        // querySelector('show-plugin').shadowRoot.

        const isMobile = window.matchMedia(`(max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')})`).matches
        if (isMobile) {
            toast.verticalAlign = 'bottom'
            toast.verticalOffset = 0
        }

        this.toast = container.appendChild(toast)
    }

    async downloadBackup () {
        console.log('== DOWNLOAD ==')
        const state = store.getState()
        const password = this.dialogContainer.getElementById('downloadBackupPassword').value
        // const data = state.user.storedWallets[state.app.selectedAddress.address]
        const data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => {})
        // 'application/json' - omit...
        console.log(data)
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

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.config = state.config
        this.user = state.user
        this.wallet = state.app.wallet
    }
}

window.customElements.define('wallet-profile', WalletProfile)
