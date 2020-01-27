import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

// import { createWallet } from '../../../qora/createWallet.js'
// import { createWallet } from '../../qora/createWallet.js'
// import { createWallet } from '../../api/createWallet.js'
import { createWallet } from '@frag/crypto'

import { doLogin, doLogout, doSelectAddress } from '../../redux/app/app-actions.js'
import { doStoreWallet } from '../../redux/user/user-actions.js'
// import { registerUsername } from '../../api/registerUsername.js'
// import { registerUsername } from 'frag-qora-crypto'

// import { logIn } from '../../actions/app-actions.js'
import '@material/mwc-button'
import '@material/mwc-checkbox'
import '@material/mwc-icon'
import '@material/mwc-formfield'
// import '@material/mwc-checkbox'
// import '@polymer/paper-checkbox/paper-checkbox.js'

import '@polymer/iron-pages'
import '@polymer/iron-label/iron-label.js'
import '@polymer/paper-input/paper-input-container.js'
import '@polymer/paper-input/paper-input.js'

import 'random-sentence-generator'

// import './loading-ripple.js'
// import ripple from '../loading-ripple.js'
import ripple from '../../functional-components/loading-ripple.js'
// import { doUpdateAccountInfo } from '../../redux/user/actions/update-account-info.js'
// import { doUpdateAccountName } from '../../redux/user/user-actions.js'

// import '@polymer/paper-spinner/paper-spinner-lite.js'
// import '@polymer/iron-flex-layout/iron-flex-layout-classes.js'

// import '@polymer/iron-pages'
// import '@polymer/paper-icon-button/paper-icon-button.js'
// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

let lastPassword = ''

class CreateAccountSection extends connect(store)(LitElement) {
    static get properties () {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextDisabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true },

            selectedPage: { type: String },
            error: { type: Boolean },
            errorMessage: { type: String },
            nextButtonText: { type: String },
            saveAccount: { type: Boolean },
            createAccountLoading: { type: Boolean },
            hasSavedSeedphrase: { type: Boolean }
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
        this.nextText = 'Next'
        this.backText = 'Back'
        this.nextDisabled = true

        this.selectedPage = 'info'
        this.nextButtonText = 'Next'
        this.saveAccount = true
        this.hasSavedSeedphrase = false
        this.createAccountLoading = false
        const welcomeMessage = 'Welcome to Qortal'
        this.welcomeMessage = welcomeMessage

        this.pages = {
            info: {
                next: e => {
                    this.error = false
                    this.errorMessage = ''
                    // const randSeedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    // const seedPhrase = this.shadowRoot.getElementById('seedPhrase').value
                    // console.log(randSeedPhrase, seedPhrase)
                    if (!this.hasSavedSeedphrase) {
                        this.error = true
                        this.errorMessage = 'Please save your seedphrase!'
                        return
                    }

                    this.nextButtonText = 'Create'
                    this.selectPage('password')
                    this.updateNext()
                },
                back: () => {
                    this.navigate('welcome')
                }
            },
            password: {
                next: e => {
                    // Create account and login :)
                    this.createAccountLoading = true

                    const pin = this.shadowRoot.getElementById('createPin').value
                    const password = this.shadowRoot.getElementById('password').value
                    console.log(this.shadowRoot.getElementById('password'))

                    if (!(pin.length === 4)) {
                        this.error = true
                        this.errorMessage = 'Please enter a 4 digit pin'
                        return
                    }

                    if (password === '') {
                        this.error = true
                        this.errorMessage = 'Please enter a password'
                    }

                    if (password.length < 8 && lastPassword !== password) {
                        this.error = true
                        this.errorMessage = 'Your password is less than 8 characters! This is not recommended. You can press login again to ignore this warning.'
                        lastPassword = password
                        return
                    }

                    const seedPhrase = this.shadowRoot.getElementById('randSentence').parsedString
                    // const password = this.shadowRoot.getElementById('createPin').value + this.shadowRoot.getElementById('birthMonth').value

                    // this.loadingRipple.welcomeMessage = welcomeMessage + ', ' + username
                    ripple.welcomeMessage = welcomeMessage

                    // this.loadingRipple.open({
                    ripple.open({
                        x: e.clientX,
                        y: e.clientY
                    })
                        .then(() => createWallet('phrase', seedPhrase, status => {
                            // this.loadingRipple.loadingMessage = status
                            ripple.loadingMessage = status
                        }))
                        .then(wallet => {
                            // .then(() => store.dispatch(doLogin('phrase', seedPhrase, status => {
                            //     this.loadingRipple.loadingMessage = status
                            // })))
                            // Get airdrop here ninja
                            // Do the callbacks here so that I can return the wallet again at the end of it

                            store.dispatch(doLogin(wallet, password))
                            store.dispatch(doSelectAddress(wallet.addresses[0]))
                            this.navigate('show-address')
                            this.cleanup()
                            // return this.loadingRipple.fade()
                            return ripple.fade()
                            // Save account after user is logged in...for good UX
                                .then(() => {
                                    console.log(this.saveAccount)
                                    if (!this.saveAccount) return
                                    return store.dispatch(doStoreWallet(wallet, password, '' /* username */, () => {
                                        // console.log('STATUS UPDATE <3')
                                        // this.loadingRipple.loadingMessage = status
                                        ripple.loadingMessage = status
                                    })).catch(err => console.error(err))
                                    // ^^ Don't want this one to break logging
                                })
                        })
                        .catch(e => {
                            this.error = true
                            this.errorMessage = e
                            console.error('== Error == \n', e)
                            store.dispatch(doLogout())
                            // this.loadingRipple.close()
                            ripple.close()
                        })
                },
                back: () => {
                    this.selectPage('info')
                    this.updateNext()
                }
            }
        }
        this.pageIndexes = {
            info: 0,
            password: 1
        }

        this.nextEnabled = false
        this.prevEnabled = false
    }

    cleanup () { // Practically the constructor...what a waste
        this.shadowRoot.getElementById('randSentence').generate()
        this.shadowRoot.getElementById('createPin').value = ''
        this.shadowRoot.getElementById('password').value = ''
        this.hasSavedSeedphrase = false
        this.selectPage('info')
        this.error = false
        this.errorMessage = ''
        this.nextButtonText = 'Next'
        this.saveAccount = true
        this.createAccountLoading = false
    }
    /*
                               <iron-label
                                    style="color:var(--mdc-theme-on-surface); display:inline-flex; cursor: pointer;" >
                                    I have saved my seedphrase &nbsp;
                                    <paper-checkbox
                                    @click=${e => { this.hasSavedSeedphrase = e.target.checked; this.updateNext() }} ?checked="${this.hasSavedSeedphrase}" iron-label-target></paper-checkbox>
                                </iron-label>
    */

    render () {
        return html`
            <style>
                div[hidden] {
                    display:none !important; 
                }
                .flex {
                    display: flex;
                }
                .flex.column {
                    flex-direction: column;
                }
                #createAccountSection {
                    max-height: calc(var(--window-height) - 56px);
                    max-width: 440px;
                    /* max-height: 500px; */
                    max-height:calc(100% - 100px);
                    padding: 0 12px;
                    overflow-y:auto;
                }
                #createAccountPages {
                    flex-shrink:1;
                    text-align: left;
                    /* overflow:auto; */
                    left:0;
                }
                #createAccountPages [page] {
                    flex-shrink:1;
                }
                /* #tosContent { */
                /* .section-content {
                    padding:0 24px;
                    padding-bottom:0;
                    overflow:auto;
                    flex-shrink:1;
                    max-height: calc(100vh - 296px);
                    
                } */

                mwc-checkbox::shadow .mdc-checkbox::after, mwc-checkbox::shadow .mdc-checkbox::before {
                    background-color:var(--mdc-theme-primary)
                }
                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    #createAccountSection {
                        /* max-height: calc(var(--window-height) - 204px); */
                        /* max-height: calc(var(--window-height) - 38px); */
                        /* height: calc(var(--window-height) - 38px); */
                        /* max-width:var(--layout-breakpoint-tablet); */
                        max-width: 100%;
                        /* height:100%; */
                        height: calc(var(--window-height) - 56px);
                    }

                    #infoContent{
                        height:auto;
                        min-height: calc(var(--window-height) - 96px)
                    }

                    /* #tosContent { */
                    /* .section-content {
                        max-height:calc(var(--window-height) - 166px);
                        min-height:calc(var(--window-height) - 166px);
                    } */
                    #nav {
                        flex-shrink:0;
                        padding-top:8px;
                    }
                }

                #infoContent p {
                    text-align: justify;
                }
                @keyframes fade {
                    from {
                        opacity: 0;
                        /* transform: translateX(-20%) */
                    }
                    to {
                        opacity: 1;
                        /* transform: translateX(0) */
                    }
                }
                iron-pages .animated {
                    animation-duration: 0.6s;
                    animation-name: fade;
                }

                paper-input {
                    --paper-input-container-input-color: var(--mdc-theme-on-surface);
                }

                paper-checkbox {
                    --paper-checkbox-checked-color: var(--mdc-theme-primary);
                    --paper-checkbox-checked-ink-color: var(--mdc-theme-primary);
                    --paper-checkbox-unchecked-color: var(--mdc-theme-on-surface);
                    --paper-checkbox-unchecked-ink-color: var(--mdc-theme-on-surface);
                    --paper-checkbox-label-color: var(--mdc-theme-on-surface);
                    --paper-checkbox-vertical-align: top;
                }

                paper-icon-button {
                    --paper-icon-button-ink-color: var(--mdc-theme-primary);
                }
            </style>
            
            <div id="createAccountSection" class="flex column">
                <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="createAccountPages">
                    <div page="info">
                        <div id="infoContent" class="section-content" style="">
                            <br>
                            <!-- <p style="margin-bottom:0;">
                                Below is a randomly generated seedphrase. You can regenerate it until you find one that you like. Please write it down and/or memorise it. You will need it in order to login to your account.
                            </p> -->
                            <h3 style="text-align:center; margin-top: 0; font-weight: 100; font-family: 'Roboto Mono', monospace;">Create account</h3>
                            <p>
                                Welcome to QORT, you will find it to be similar to that of an RPG game, you, as a minter on the QORT network (if you choose to become one) will have the chance to level your account up, giving you both more of the QORT block reward and also larger influence over the network in terms of voting on decisions for the platform. 
                            </p>
                            <p style="margin-bottom:0;">
                                The first step, is to create your QORT account! Below, you will see a randomly generated ‘seedphrase’. This phrase is used as your private key generator for your blockchain account in QORT. Please write this phrase down and save it somewhere safe. This is extremely important information for your QORT account.
                            </p>

                            <!-- border-bottom: 2px solid var(--mdc-theme-primary); border-top: 2px solid var(--mdc-theme-primary); -->
                            <div style="border-radius: 4px; padding-top: 8px; background: rgba(3,169,244,0.1); margin-top: 24px;">
                                <div style="display: inline-block; padding:12px; width:calc(100% - 84px);">
                                    <random-sentence-generator
                                        template="adverb verb the adjective noun and verb the adjective noun with the adjective noun"
                                        id="randSentence"></random-sentence-generator>
                                </div>
                                        <!--
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            Calculations
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            403 adjectives
                                            60 interjections
                                            243 adverbs
                                            2353 nouns
                                            3387 verbs
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            sooo 243*3387*403*2353*3387*403*2353*403*2353 ~ 2^92
                                            --- --- --- --- --- --- --- --- --- --- --- -
                                            -->
                                <paper-icon-button
                                    icon="icons:autorenew"
                                    style="top:-12px; margin:8px;"
                                    @click=${() => this.shadowRoot.getElementById('randSentence').generate()}
                                ></paper-icon-button>
                            </div>
                             <!-- <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                                <paper-input style="width:100%;" id="seedPhrase" always-float-labell label="Repeat seed phrase"></paper-input>
                            </div> -->
                        </div>
                        <div style="text-align:right; vertical-align: top; line-height: 40px; margin:0;">
                                <label
                                    for="hasSavedSeedphraseCheckbox"
                                    @click=${() => this.shadowRoot.getElementById('hasSavedSeedphraseCheckbox').click()}
                                    >I have saved my seedphrase</label>
                                    <mwc-checkbox id="hasSavedSeedphraseCheckbox" @click=${e => { this.hasSavedSeedphrase = !e.target.checked; this.updateNext() }} ?checked=${this.hasSavedSeedphrase}></mwc-checkbox>
                                <!-- <paper-checkbox>I have saved my seedphrase!</paper-checkbox> -->
                            </div>
                    </div>

                    <div page="password">
                        <div id="saveContent" class="section-content">
                            <p style="text-align: justify;">Your account is now ready to be created. It will be saved in this browser. If you do not want your new account to be saved in your browser you can uncheck the box below. You will still be able to login with your new account(after logging out), you'll just have to retype your seedphrase.</p>
                            <div style="display:flex;">
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 26px;">lock</mwc-icon>
                                <paper-input style="width:100%;" always-float-labell label="Pin" id="createPin" type="password"  pattern="[0-9]*" inputmode="numeric" maxlength="4"></paper-input>
                            </div>
                            <div style="display:flex;" ?hidden=${!this.saveAccount}>
                                <mwc-icon style="padding: 20px; padding-left:0; padding-top: 28px;">vpn_key</mwc-icon>
                                <paper-input style="width:100%;" label="Password" id="password" type="password"></paper-input>
                            </div>
                            <div style="text-align:right; padding-right:8px; min-height:40px;">
                                <iron-label
                                    style="color:var(--mdc-theme-primary); display:inline-flex; cursor: pointer;" >
                                    Save in this browser &nbsp;
                                    <paper-checkbox
                                    @click=${e => { this.saveAccount = e.target.checked }} ?checked="${this.saveAccount}" iron-label-target></paper-checkbox>
                                </iron-label>
                            </div>
                        </div>
                    </div>
                </iron-pages>
                <div id="errorMessage" style="height:24px; line-height:24px; vertical-align:top; color: var(--mdc-theme-error); text-align:right; padding: 0 16px; padding-bottom:6px;">
                   
                    <span style="margin-top:-4px;height:24px;">
                        ${this.error ? html`
                             <mwc-icon style="line-height:24px; vertical-align: top; margin-top:-2px;">block</mwc-icon>
                            ${this.errorMessage}` : ''}
                    </span>
                </div>
            </div>

            <!-- <loading-ripple id="loadingRipple" welcome-message="${this.welcomeMessage}"></loading-ripple> -->
        `
    }

    /*
            <div id="nav">
                <mwc-button
                    ?disabled=${this.selectedPage === 'info'}
                    @click=${() => this.pages[this.selectedPage].prev()}
                    style="margin: 0 0 12px 12px;">
                    <mwc-icon>keyboard_arrow_left</mwc-icon> Back
                </mwc-button>
                <mwc-button
                    ?disabled=${!this.hasSavedSeedphrase}
                    @click=${e => this.pages[this.selectedPage].next(e)}
                    style="margin: 0 12px 12px 0; float:right;">
                    ${this.nextButtonText} <mwc-icon>keyboard_arrow_right</mwc-icon>
                </mwc-button>
            </div>
            */

    firstUpdated () {
        // this.loadingRipple = this.shadowRoot.getElementById('loadingRipple')
    }

    _pageChange (newPage, oldPage) {
        if (!this.shadowRoot.querySelector('#createAccountPages') || !newPage) {
            return
        }
        const pages = this.shadowRoot.querySelector('#createAccountPages').children
        // Run the animation on the newly selected page
        const newIndex = this.pageIndexes[newPage]
        if (!pages[newIndex].className.includes('animated')) {
            pages[newIndex].className += ' animated'
        }

        if (typeof oldPage !== 'undefined') {
            const oldIndex = this.pageIndexes[oldPage]
            // Stop the animation of hidden pages
            // pages[oldIndex].className = pages[oldIndex].className.split(' animated').join('');
            pages[oldIndex].classList.remove('animated')
        }
    }

    selectPage (newPage) {
        const oldPage = this.selectedPage
        this.selectedPage = newPage
        this._pageChange(newPage, oldPage)
    }

    updateNext () {
        if (this.selectedPage === 'info') {
            this.nextText = 'Next'
            this.nextDisabled = !this.hasSavedSeedphrase
        } else if (this.selectPage ==='password') {
            this.nextDisabled = false
            this.nextText = 'Create account'
        }

        this.updatedProperty()
    }

    back (e) {
        this.pages[this.selectedPage].back(e)
    }

    next (e) {
        this.pages[this.selectedPage].next(e)
        // if (this.selectedPage === 'info') {
        //     this.selectPage('password')
        // }
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

    stateChanged (state) {
        // this.loggedIn = state.app.loggedIn
    }

    createAccount () {

    }
}

window.customElements.define('create-account-section', CreateAccountSection)
