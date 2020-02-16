import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'
import { stateAwait } from '../../stateAwait.js'

// import { createWallet } from '../../qora/createWallet.js'
// import { generateSaveWalletData } from '../../qora/storeWallet.js'
// import { doSelectAddress } from '../../redux/app/app-actions.js'
// import { doStoreWallet } from '../../redux/user/user-actions.js'

// import { logIn } from '../../actions/app-actions.js'

import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-fab'

import '@polymer/iron-pages'
import '@polymer/paper-icon-button/paper-icon-button.js'

// import particleJS from 'particle.js'
import './particle.js'

import './welcome-page.js'
import './create-account-section.js'
import './login-section.js'
import './show-address.js'

import getParticleConfig from './particle-config.js'

import settings from '../../functional-components/settings-page.js'

window.reduxStore = store

const animationDuration = 0.7 // Seconds

// import { MDCTextField } from '@material/textfield'
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'))

class LoginView extends connect(store)(LitElement) {
    static get properties () {
        return {
            loggedIn: { type: 'Boolean' },
            selectedPage: { type: 'String' },
            pages: { type: Object },
            rippleIsOpen: { type: Boolean },
            config: { type: Object },
            rippleLoadingMessage: { type: String },
            selectedPageElement: { }
        }
    }

    static get styles () {
        return [
            css`
                
            `
        ]
    }

    getPreSelectedPage () {
        // return (store.getState().user.storedWallets && Object.entries(store.getState().user.storedWallets || {}).length > 0) ? 'login' : 'welcome'
        return 'welcome'
    }

    constructor () {
        super()
        this.selectedPage = this.getPreSelectedPage()
        this.selectedPageElement = {}
        this.rippleIsOpen = false
        this.pages = {
            welcome: 0,
            'create-account': 1,
            login: 2
        }
        this.rippleLoadingMessage = 'Getting information'
    }

    firstUpdated () {
        // this.shadowRoot.getElementById('createAccountSection').loginFunction = (...args) => this.login(...args)
        // this.shadowRoot.getElementById('loginSection').loginFunction = (...args) => this.login(...args)
        stateAwait(state => {
            return 'primary' in state.config.styles.theme.colors
        }).then(() => {
            const particleDiv = this.shadowRoot.querySelector('#particles-js')
            const part = new particlesJS(particleDiv, getParticleConfig(this.config), (c) => {
                //
            })
        }).catch(e => console.error(e))

        const loginContainerPages = this.shadowRoot.querySelector('#loginContainerPages')
        const loginCard = this.shadowRoot.querySelector('#login-card')
        const navigate = e => {
            this.selectPage(e.detail.page)
        }
        const updatedProperty = e => {
            // ...
            const selectedPageElement = this.selectedPageElement
            this.selectedPageElement = {}
            setTimeout(() => { this.selectedPageElement = selectedPageElement }, 1) // Yuck
        }
        loginContainerPages.addEventListener('selected-item-changed', () => {
            // Undefined is the remove step...
            if (!loginContainerPages.selectedItem) {
                // Remove the old... if it was. Not entirely sure it's needed
                if (this.selectedPageElement.removeEventListener) {
                    this.selectedPageElement.removeEventListener('navigate', navigate)
                    this.selectedPageElement.removeEventListener('updatedProperty', updatedProperty)
                }
                this.selectedPageElement = {}
                loginCard.classList.remove('animated')
                loginCard.className += ' animated'
            } else {
                setTimeout(() => {
                    // reference the new
                    this.selectedPageElement = loginContainerPages.selectedItem
                    // and listen to it
                    this.selectedPageElement.addEventListener('navigate', navigate)
                    this.selectedPageElement.addEventListener('updatedProperty', updatedProperty)
                    setTimeout(() => loginCard.classList.remove('animated'), animationDuration * 1000)
                }, 1) // Make it async so that it actually notices the object reassignment up above... I feel like there's a better way but I'm a n00b
            }
        })
    }

    render () {
        return html`
            <style>
                canvas {
                    display: block;
                    vertical-align: bottom;
                } /* ---- particles.js container ---- */
                #particles-js {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index:0;
                    background-color: var(--mdc-theme-background);
                    background-image: url("");
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: 50% 50%;
                }
                /* GO SASSSSSSS ASAPPP */
                .login-page {
                    height: var(--window-height);
                    width:100vw;
                    max-width:100vw;
                    max-height:var(--window-height);
                    position:absolute;
                    top:0;
                    left:0;
                    /* background: var(--mdc-theme-surface); */
                    /* background: var(--mdc-theme-background); */
                    /* background: #333; Needs to become configurable... */
                    z-index:1;
                }
                .login-card-container {
                    max-width:1240px;
                    max-height:var(--window-height);
/* 
                    padding-right: 15px;
                    padding-left: 15px; */
                    margin-right: auto;
                    margin-left: auto;

                    width: calc(100vw);
                }

                .qortal-logo {
                    padding:40px 30px;
                    position: absolute;
                    width:120px;
                    max-width:40%;
                    z-index:1;
                }
                .login-card-center-container {
                    max-width:100%;
                    max-height:var(--window-height);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: var(--window-height);
                    overflow:hidden;
                }
                #loginContainerPages {
                    display:inline;
                }
                #loginContainerPages [page] {
                    /* background: var(--mdc-theme-surface); */
                    background: none;
                    padding:0;
                }
                .login-card {
                    min-width: 340px;
                    /* background: var(--mdc-theme-surface); */
                    background: var(--mdc-theme-background);
                    border-bottom: 2px solid var(--mdc-theme-primary);
                    border-top: 2px solid var(--mdc-theme-primary);
                    text-align:center;
                    z-index:0;

                    /* box-shadow: var(--shadow-4); */
                    /* padding: 12px; */
                    padding:0;
                    border: 0;
                    border-radius: 4px;
                }
                .login-card p {
                    margin-top: 0;
                    font-size: 1rem;
                    font-style: italic;
                }
                .login-card h1{
                    margin-bottom:12px;
                    font-size:64px;
                }
                .login-card iron-pages {
                    height:100%;
                }
                .backButton {
                    padding-top:18px;
                    text-align:center;
                }
                #login-pages-nav {
                    text-align: left;
                    /* padding-bottom:8px; */
                    padding: 12px 0 8px 0;
                }
                #nav-next {
                    float: right;
                }
                @media only screen and (min-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Desktop/tablet */
                    .login-card {
                        /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
                        max-width:460px;
                    }
                    #loginContainerPages [page] {
                        /* border: 1px solid var(--mdc-theme-on-surface); */
                        /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
                        border-radius: 4px;
                        /* padding: 6px; */
                    }
                    #loginContainerPages [page="welcome"] {

                    }
                }
                @media only screen and (max-width: ${getComputedStyle(document.body).getPropertyValue('--layout-breakpoint-tablet')}) {
                    /* Mobile */
                    .qortal-logo {
                        display:none;
                        visibility:hidden;
                    }
                    .login-page {
                        background: var(--mdc-theme-surface);
                    }
                    .login-card{
                        /* height:100%; */
                        width:100%;
                        margin:0;
                        top:0;
                        max-width:100%;
                    }
                    .backButton {
                        text-align: left;
                        padding-left:12px;
                    }
                }

                @keyframes fade {
                    from {
                        opacity: 0;
                        transform: translateX(-20%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes grow-up {
                    from {
                        overflow:hidden;
                        max-height:0;
                    }
                    to {
                        overflow:hidden;
                        max-height:var(--window-height);
                    }
                }
                iron-pages .animated, .animated {
                    animation-duration: ${animationDuration}s;
                    animation-name: grow-up;
                }
                div[page] > paper-icon-button {
                    margin:12px;
                }
                .corner-box {
                    border-color: var(--mdc-theme-primary) !important;
                }
                [hidden] {
                    visibility: hidden;
                    display: none;
                }
            </style>

                <!-- These are to enable/disable the actual logging in... can just leave it on the show-address page.   -->
            <div class="login-page" ?hidden=${this.loggedIn}>
            <!-- <div class="login-page"> -->
                <div id="particles-js"></div>
                <mwc-fab icon="settings" style="position:fixed; right:24px; bottom:24px;" @click=${() => settings.show()}></mwc-fab>
                <div class="login-card-container">
                    <img class="qortal-logo" src="${this.config.coin.logo}">
                    <div class="login-card-center-container">
                        <div class="login-card" id="login-card">
                            <!-- <div class='corner-box' style="width:50px; height:50px; border-left:3px solid; border-top: 3px solid; float:left; margin-left:-50px;"></div> -->
                            <iron-pages selected="${this.selectedPage}" attr-for-selected="page" id="loginContainerPages">
                                <!-- Instead make the page fire a page change event, catch it and respond -->
                                <welcome-page @next=${e => this.selectedPageElement.next(e)} page="welcome"></welcome-page>
                                <create-account-section @next=${e => this.selectedPageElement.next(e)} page="create-account"></create-account-section>
                                <login-section @next=${e => this.selectedPageElement.next(e)} page="login"></login-section>
                                <show-address @next=${e => this.selectedPageElement.next(e)} page="show-address"></show-address>
                            </iron-pages>
                            <div id="login-pages-nav" ?hidden="${this.selectedPageElement.hideNav}">
                                <mwc-button @click=${e => this.selectedPageElement.back(e)} id="nav-back" ?hidden="${this.selectedPageElement.backHidden}" ?disabled="${this.selectedPageElement.backDisabled}">
                                    <mwc-icon>keyboard_arrow_left</mwc-icon>${this.selectedPageElement.backText}
                                </mwc-button>

                                <mwc-button @click=${e => this.selectedPageElement.next(e)} id="nav-next" ?hidden="${this.selectedPageElement.nextHidden}" ?disabled="${this.selectedPageElement.nextDisabled}">
                                    ${this.selectedPageElement.nextText}<mwc-icon>keyboard_arrow_right</mwc-icon>
                                </mwc-button>
                            </div>

                            <!-- <div class='corner-box' style="width:50px; height:50px; border-right:3px solid; border-bottom: 3px solid; float:right; margin-right:-50px; margin-top:-50px;"></div> -->
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    selectPage (newPage) {
        // const oldPage = this.selectedPage
        this.selectedPage = newPage
        // this._pageChange(newPage, oldPage)
    }
    // Doesn't actually do anything now
    // So let's comment it!
    // _pageChange (newPage, oldPage) {
    //     if (!this.shadowRoot.querySelector('#loginContainerPages') || !newPage) {
    //         return
    //     }
    //     const pages = this.shadowRoot.querySelector('#loginContainerPages').children
    //     // Run the animation on the newly selected page
    //     const newIndex = this.pages[newPage]
    //     if (!pages[newIndex].className.includes('animated')) {
    //         // pages[newIndex].className += ' animated'
    //     }

    //     if (typeof oldPage !== 'undefined') {
    //         const oldIndex = this.pages[oldPage]
    //         // Stop the animation of hidden pages
    //         // pages[oldIndex].className = pages[oldIndex].className.split(' animated').join('');
    //         pages[oldIndex].classList.remove('animated')
    //     }
    // }

    stateChanged (state) {
        if (this.loggedIn && !state.app.loggedIn) this.cleanup()
        this.loggedIn = state.app.loggedIn
        this.config = state.config
    }

    cleanup () {
        this.selectedPage = 'welcome'
    }
}

window.customElements.define('login-view', LoginView)
