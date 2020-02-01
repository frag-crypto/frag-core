import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

// import { logIn } from '../../actions/app-actions.js'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-dialog'
import '@material/mwc-formfield'

import '@polymer/iron-pages'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-ripple'
import '@polymer/iron-collapse'
import '@polymer/paper-spinner/paper-spinner-lite.js'

import { doLogin, doSelectAddress } from '../../redux/app/app-actions.js'
// import { doUpdateAccountInfo } from '../../redux/user/actions/update-account-info.js'
// import { doUpdateAccountName } from '../../redux/user/user-actions.js'
// import { createWallet } from '../../qora/createWallet.js'
// import { createWallet } from '../../api/createWallet.js'
// import { createWallet } from 'frag-qora-crypto'
import { createWallet } from '@frag/crypto'

import snackbar from '../../functional-components/snackbar.js'
import '../../custom-elements/frag-file-input.js'
// import ripple from '../loading-ripple.js'
import ripple from '../../functional-components/loading-ripple.js'

// import '@polymer/iron-pages'
// import '@polymer/paper-icon-button/paper-icon-button.js'
// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginSection extends connect(store)(LitElement) {
    static get properties () {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextDisabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },

            loginFunction: { type: Object },
            selectedWallet: { type: Object },
            selectedPage: { type: String },
            wallets: { type: Object },
            loginErrorMessage: { type: String },
            rememberMe: { type: Boolean },
            hasStoredWallets: { type: Boolean },
            showPasswordField: { type: Boolean },
            backedUpWalletJSON: { type: Object },

            backedUpSeedLoading: { type: Boolean }
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
        this.nextHidden = true
        this.backText = 'Back'

        this.backedUpSeedLoading = false
        this.hasStoredWallets = Object.keys(store.getState().user.storedWallets).length > 0
        this.selectedPage = this.hasStoredWallets ? 'storedWallet' : 'loginOptions'
        this.selectedWallet = {}
        this.loginErrorMessage = ''
        this.rememberMe = false

        this.loginOptions = [
            {
                page: 'phrase',
                linkText: 'Seedphrase',
                icon: 'short_text'
            },
            {
                page: 'storedWallet',
                linkText: 'Saved account',
                icon: 'save'
            },
            {
                page: 'seed',
                linkText: 'Qora seed',
                icon: 'clear_all'
            },
            {
                page: 'backedUpSeed',
                linkText: 'Qortal wallet backup',
                icon: 'insert_drive_file'
            }
        ]

        this.showPasswordCheckboxPages = ['seed', 'phrase', 'V1Seed']
        this.showPasswordPages = [
            // ...this.showPasswordCheckboxPages,
            'storedWallet',
            'unlockBackedUpSeed'
        ]
    }

    render () {
        return html`
            <style>
                #loginSection {
                    padding:0;
                    text-align:left;
                    padding-top: 12px;
                    --paper-spinner-color: var(--mdc-theme-primary);
                    --paper-spinner-stroke-width: 2px;
                }
                #wallets {
                    max-height: 400px;
                    overflow-y:auto;
                    overflow-x:hidden;
                    border-bottom: 1px solid #eee;
                    border-top: 1px solid #eee;
                }
                .wallet {
                    /* max-width: 300px; */
                    position: relative;
                    padding: 12px;
                    cursor: pointer;
                    display: flex;
                }
                .wallet .wallet-details {
                    padding-left:12px;
                    flex: 1;
                    min-width: 0;
                }
                .wallet div .address{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin:0;
                }
                .wallet .wallet-details h3 {
                    margin:0;
                    padding: 6px 0;
                    font-size:16px;
                }
                .login-option {
                    max-width: 300px;
                    position: relative;
                    padding: 16px 0 8px 12px;
                    cursor: pointer;
                    display: flex;
                }
                .loginIcon {
                    /* font-size:42px; */
                    padding-right: 12px;
                    margin-top: -2px;
                }
                *[hidden] { 
                    display:none !important;
                    visibility: hidden;
                }
                h1 {
                    padding: 24px;
                    padding-top:0;
                    margin:0;
                    font-size:24px;
                    font-weight:100;
                }
                .accountIcon {
                    font-size:42px;
                    padding-top:8px;
                }

                #unlockStoredPage {
                    padding: 24px;
                }
                #unlockStoredPage mwc-icon {
                    font-size:48px;
                }

                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #wallets {
                        /* max-height: calc(var(--window-height) - 180px);
                        min-height: calc(var(--window-height) - 180px); */
                        height:100%;
                        overflow-y:auto;
                        overflow-x:hidden;
                    }
                    #loginSection {
                        height: calc(var(--window-height) - 56px);
                    }
                    .wallet {
                        max-width: 100%;
                    }
                }
                .backButton {
                    padding:14px;
                    text-align:left;
                }
                iron-pages h3{
                    color: #333;
                    font-family: "Roboto mono", monospace;
                    font-weight: 300;
                }
                #pagesContainer {
                    max-height: calc(var(--window-height) - 184px);
                }
            </style>
            
            <div id="loginSection">
                <div id="pagesContainer">
                    <iron-pages style="padding: 0;" selected="${this.selectedPage}" attr-for-selected="page" id="loginPages">
                        <div page="loginOptions">
                            <h3>How would you like to login?</h3>
                            ${this.loginOptions.map(({ page, linkText, icon }) => html`
                                <div class="login-option" @click=${() => { this.selectedPage = page }}>
                                    <paper-ripple></paper-ripple>
                                    <div>
                                        <mwc-icon class='loginIcon'>${icon}</mwc-icon>
                                    </div>
                                    <div>
                                        ${linkText}
                                    </div>
                                </div>
                            `)}
                        </div>

                        <div page="storedWallet" id="walletsPage">
                            <div style="padding-left:0;">
                                <h1 style="padding:0;">Your accounts</h1>
                                <p style="margin:0; padding: 0 0 12px 0;">Click your account to login with it</p>
                            </div>
                            <div id="wallets">
                                ${(Object.entries(this.wallets || {}).length < 1) ? html`
                                    <p style="padding: 0 0 6px 0;">You need to create or save an account before you can log in!</p>
                                ` : ''}
                                ${Object.entries(this.wallets || {}).map(wallet => html`
                                    <div class="wallet" @click=${() => this.selectWallet(wallet[1])}>
                                        <paper-ripple></paper-ripple>
                                        <div>
                                            <mwc-icon class='accountIcon'>account_circle</mwc-icon>
                                        </div>
                                        <div class="wallet-details">
                                            <h3>${wallet[1].name || wallet[1].address0.substring(0, 5)}</h3>
                                            <p class="address">${wallet[1].address0}</p>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div page="phrase" id="phrasePage">
                            <div style="padding:0;">
                                <div style="display:flex;">
                                    <!-- <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">short_text</mwc-icon> -->
                                    <mwc-textfield icon="short_text" style="width:100%;" label="Seedphrase" id="existingSeedPhraseInput" type="password"></mwc-textfield>
                                    <!-- <paper-input style="width:100%;" label="Seedphrase" id="existingSeedPhraseInput" type="password"></paper-input> -->
                                </div>
                            </div>
                        </div>

                        <div page="seed" id="seedPage">
                            <div>
                                <div style="display:flex;">
                                    <!-- <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">lock</mwc-icon> -->
                                    <mwc-textfield style="width:100%;" icon="clear_all" label="Qora seed" id="v1SeedInput" type="password"></mwc-textfield>
                                    <!-- <paper-input style="width:100%;" label="V1 Seed" id="v1SeedInput" type="password"></paper-input> -->
                                </div>
                            </div>
                        </div>

                        <div page="unlockStored" id="unlockStoredPage">
                            <div style="text-align:center;">
                                <mwc-icon id='accountIcon' style=" padding-bottom:24px;">account_circle</mwc-icon>
                                <br>
                                <span style="font-size:14px; font-weight:100; font-family: 'Roboto Mono', monospace;">${this.selectedWallet.address0}</span>
                            </div>
                        </div>

                        <div page="backedUpSeed">
                            ${!this.backedUpSeedLoading ? html`
                                <h3>Upload your qortal backup</h3>
                                <!-- (qortal_backup_Q123456789abcdefghkjkmnpqrs.json) -->
                                <frag-file-input accept=".zip,.json" @file-read-success="${e => this.loadBackup(e.detail.result)}"></frag-file-input>
                            ` : html`
                                <paper-spinner-lite active style="display: block; margin: 0 auto;"></paper-spinner-lite>
                            `}
                        </div>

                        <div page="unlockBackedUpSeed">
                            <h3>Decrypt backup</h3>
                        </div>

                    </iron-pages>

                    <iron-collapse style="" ?opened=${(this.showPasswordField && this.showPasswordCheckboxPages.includes(this.selectedPage)) || (this.showPasswordPages.includes(this.selectedPage) && (this.wallets || {}).length < 1) || this.selectedPage === 'unlockBackedUpSeed'} id="passwordCollapse">
                        <div style="display:flex;">
                            <!-- <mwc-icon style="padding: 20px; font-size:24px; padding-left:0; padding-top: 26px;">vpn_key</mwc-icon> -->
                            <mwc-textfield icon="vpn_key" style="width:100%;" label="Password" id="password" type="password"></mwc-textfield>
                            <!-- <paper-input style="width:100%;" always-float-labell label="Password" id="password" type="password"></paper-input> -->
                        </div>
                    </iron-collapse>

                    <div style="text-align: right; color: var(--mdc-theme-error)">
                        ${this.loginErrorMessage}
                    </div>
                        ${this.showPasswordCheckboxPages.includes(this.selectedPage) ? html`
                            <!-- Remember me checkbox and fields-->
                            <div style="text-align:right; min-height:40px;">
                                <p style="vertical-align: top; line-height: 40px; margin:0;">
                                    <label
                                    for="storeCheckbox"
                                    @click=${() => this.shadowRoot.getElementById('storeCheckbox').click()}
                                    >Save in this browser</label>
                                    <mwc-checkbox id="storeCheckbox" style="margin-bottom:-12px;" @click=${e => { this.showPasswordField = !e.target.checked }} ?checked="${this.showPasswordField}"></mwc-checkbox>
                                </p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Passes this.selectedPage to trigger updates -->

            </div>
        `
    }
    /*

                <div style="margin-left:24px; margin-right:24px;" ?hidden=${!(this.loginOptionIsSelected(this.selectedPage) && (this.hasStoredWallets || this.selectedPage !== 'storedWallet'))}>
                    <mwc-button style="margin-top:12px; width:100%;" raised @click=${e => this.login(e)}>Login</mwc-button>
                </div>
    */

    firstUpdated () {
        // this.loadingRipple = this.shadowRoot.getElementById('loadingRipple')
        this.loadingRipple = ripple // Just cause I'm lazy...

        const pages = this.shadowRoot.querySelector('#loginPages')
        pages.addEventListener('selected-item-changed', () => {
            if (!pages.selectedItem) {
                // ...
            } else {
                this.updateNext()
                this.shadowRoot.querySelector('#password').value = ''
            }
        })
    }

    selectWallet (wallet) {
        this.selectedWallet = wallet
        this.selectedPage = 'unlockStored'
    }

    stateChanged (state) {
        this.loggedIn = state.app.loggedIn
        this.wallets = state.user.storedWallets
        this.hasStoredWallets = this.wallets.length > 0
    }

    loadBackup (file) {
        let error = ''
        let pf
        this.selectedPage = 'unlockBackedUpSeed'

        try {
            pf = JSON.parse(file)
        } catch (e) {
            this.loginErrorMessage = 'Backup must be valid JSON'
        }

        try {
            const requiredFields = ['address0', 'salt', 'iv', 'version', 'encryptedSeed', 'mac', 'kdfThreads']
            for (const field of requiredFields) {
                if (!(field in pf)) throw field + ' not found in JSON'
            }
        } catch (e) {
            error = e
        }

        if (error !== '') {
            snackbar.add({
                labelText: error
            })
            this.selectedPage = 'backedUpSeed'
            return
        }
        this.backedUpWalletJSON = pf
    }

    get walletSources () {
        return {
            seed: () => {
                const seed = this.shadowRoot.querySelector('#v1SeedInput').value
                return seed
            },
            storedWallet: () => {
                const wallet = this.selectedWallet
                console.log(wallet)
                // const password = this.shadowRoot.querySelector('#password').value
                const password = this.shadowRoot.getElementById('password').value
                return {
                    wallet,
                    password
                }
            },
            phrase: () => {
                const seedPhrase = this.shadowRoot.querySelector('#existingSeedPhraseInput').value
                return seedPhrase
            },
            backedUpSeed: () => {
                const wallet = this.backedUpWalletJSON
                console.log(wallet)
                const password = this.shadowRoot.getElementById('password').value
                return {
                    password,
                    wallet
                }
            }
        }
    }

    loginOptionIsSelected (type) {
        return this.loginOptions.map(op => op.page).includes(type)
    }

    login (e) {
        let type = this.selectedPage === 'unlockStored' ? 'storedWallet' : this.selectedPage
        type = type === 'unlockBackedUpSeed' ? 'backedUpSeed' : type

        if (!this.loginOptionIsSelected(type)) {
            throw new Error('Login option not selected page')
        }

        // First decrypt...
        this.loadingRipple.open({
            x: e.clientX,
            y: e.clientY
        })
            .then(() => {
                const source = this.walletSources[type]()
                return createWallet(type, source, status => {
                    this.loadingRipple.loadingMessage = status
                })
            })
            .then(wallet => {
                store.dispatch(doLogin(wallet))
                console.log(wallet)
                store.dispatch(doSelectAddress(wallet.addresses[0]))
                this.navigate('show-address')
                // store.dispatch(doUpdateAccountInfo({ name: store.getState().user.storedWallets[wallet.addresses[0].address].name }))
                const storedWallets = store.getState().user.storedWallets
                const walletAddress = storedWallets[wallet.addresses[0].address]
                // STORAGEEEE
                if (walletAddress) {
                    // const expectedName = storedWallets[wallet.addresses[0].address].name
                    // store.dispatch(doUpdateAccountName(wallet.addresses[0].address, expectedName, false))
                    if (this.rememberMe && type !== 'storedWallet') {
                        //
                    }
                }
                this.cleanup()
                return this.loadingRipple.fade()
            })
            .then(() => {

            })
            .catch(e => {
                this.loginErrorMessage = e
                console.error(e)
                return this.loadingRipple.close()
            })
    }

    back () {
        if (['seed', 'phrase', 'storedWallet', 'backedUpSeed'].includes(this.selectedPage)) {
            this.selectedPage = 'loginOptions'
        } else if (this.selectedPage === 'loginOptions') {
            this.navigate('welcome')
        } else if (this.selectedPage === 'unlockStored') {
            this.selectedPage = 'storedWallet'
        } else if (this.selectedPage === 'unlockBackedUpSeed') {
            this.selectedPage = 'backedUpSeed'
        }
    }

    next (e) {
        this.login(e)
    }

    updateNext () {
        if (['phrase', 'seed', 'unlockStored', 'unlockBackedUpSeed'].includes(this.selectedPage)) {
            this.nextText = 'Login'
            this.nextHidden = false
            // Should enable/disable the next button based on whether or not password are inputted
        } else if (['storedWallet', 'loginOptions', 'backedUpSeed'].includes(this.selectedPage)) {
            this.nextHidden = true
            this.nextText = 'Next'
        }

        this.updatedProperty()
    }

    updatedProperty () {
        this.dispatchEvent(new CustomEvent('updatedProperty', {
            detail: {},
            bubbles: true,
            composed: true
        }))
    }

    navigate (page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }

    cleanup () {
        this.wallet = {}
        this.shadowRoot.querySelector('#password').value = ''
        this.hasStoredWallets = Object.keys(store.getState().user.storedWallets).length > 0
        this.selectedPage = this.hasStoredWallets ? 'storedWallet' : 'loginOptions'
    }
}

window.customElements.define('login-section', LoginSection)
