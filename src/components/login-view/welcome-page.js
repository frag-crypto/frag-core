import { LitElement, html, css } from 'lit-element'

import '@material/mwc-button'

class WelcomePage extends LitElement {
    static get properties () {
        return {
            nextHidden: { type: Boolean, notify: true },
            nextEnabled: { type: Boolean, notify: true },
            nextText: { type: String, notify: true },
            backHidden: { type: Boolean, notify: true },
            backDisabled: { type: Boolean, notify: true },
            backText: { type: String, notify: true },
            hideNav: { type: Boolean, notify: true }
        }
    }

    static get styles () {
        return [
            css`
                mwc-button {
                    margin: 6px;
                    width: 90%;
                    max-width:90vw;
                    margin: 4px;
                }
                .welcome-page {
                    padding: 12px 0;
                }
            `
        ]
    }

    constructor () {
        super()
        this.hideNav = true
        this.nextText = 'prrrr'
        const welcomeMessage = 'Welcome to Qortal' // Should be from config
        this.welcomeMessage = welcomeMessage
    }

    firstUpdate () {
        // ...
    }
    /*
                <!-- <i style="visibility: hidden; float:right; padding:24px;">${this.config.coin.name} ${this.config.version}</i>
                <br>
                <br> -->
                <!-- <h1>Karma</h1> -->
                <!-- <img src="${this.config.coin.logo}" style="max-width: 300px; width:60%;"> -->
                <!-- <p>Enter the Karmaconomy</p> -->
    */

    render () {
        return html`            
            <div class='welcome-page'>
                <mwc-button
                    @click=${() => this.navigate('create-account')}
                    raised
                    style="border-top:0; border-bottom:0;"
                >
                    <!--outlined -->
                    Create account
                </mwc-button>
                <mwc-button
                    @click=${() => this.navigate('login')}
                >
                    Login
                </mwc-button>
                <!-- <div style="text-align: right; padding:12px;">
                    <br>
                    <p style="margin:0; font-size: 0.9rem">Karmaship, LLC [alpha build v2.0]</p>
                    <p style="font-size: 0.9rem"><i><small>Rewarding real life experiences</small></i></p>
                </div> -->
                <!-- <login-welcome-page selected-page="{{selectedPage}}"></login-welcome-page> -->
            </div>
        `
    }

    back () {}

    next () {}

    navigate (page) {
        this.dispatchEvent(new CustomEvent('navigate', {
            detail: { page },
            bubbles: true,
            composed: true
        }))
    }
}

window.customElements.define('welcome-page', WelcomePage)
