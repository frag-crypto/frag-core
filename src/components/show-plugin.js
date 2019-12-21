import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from '../plugins/addPluginRoutes.js'

class ShowPlugin extends connect(store)(LitElement) {
    static get properties () {
        return {
            app: { type: Object },
            pluginConfig: { type: Object },
            url: { type: String }
        }
    }

    static get styles () {
        return css`
            iframe#showPluginFrame {
                width:100%;
                height:calc(var(--window-height) - 68px);
                border:0;
                padding:0;
                margin:0;
            }
        `
    }

    // ${window.location.protocol}//${this.pluginConfig.domain}:${this.pluginConfig.port}/plugins/${this.app.registeredUrls[this.url].page}

    /*
    <iframe src="${this.app.registeredUrls[this.url] ? `
                ${window.location.protocol}//${window.location.hostname}:${this.pluginConfig.port}/plugins/${this.app.registeredUrls[this.url].page}
            ` : `about:blank`}" id="showPluginFrame"></iframe>

                        <iframe src="${this.app.registeredUrls[this.url] ? `
                ${window.location.protocol}//${window.location.hostname}:${this.pluginConfig.port}/plugins/${this.app.registeredUrls[this.url].page}
            ` : 'about:blank'}" id="showPluginFrame"></iframe>
            */
    render () {
        // console.log(this.app.registeredUrls[this.url])
        // console.log(this.app.registeredUrls)
        // Let's come back to this...
        return html`
            <iframe src="${this.app.registeredUrls[this.url] ? `
                ${window.location.protocol}//${this.app.registeredUrls[this.url].domain}.${window.location.hostname}/${this.app.registeredUrls[this.url].page}
            ` : 'about:blank'}" id="showPluginFrame"></iframe>
        `
    }

    firstUpdated (changedProps) {
        console.log(changedProps)
        const showingPluginEpml = new Epml({
            type: 'WINDOW',
            source: this.shadowRoot.getElementById('showPluginFrame').contentWindow
        })
        addPluginRoutes(showingPluginEpml)
        showingPluginEpml.imReady()
        this.showingPluginEpml = showingPluginEpml
        Epml.registerProxyInstance('visible-plugin', showingPluginEpml)
        console.log(showingPluginEpml)
    }

    updated (changedProps) {
        if (changedProps.has('url')) {
            //
        }

        if (changedProps.has('computerUrl')) {
            if (this.computedUrl !== 'about:blank') {
                this.loading = true
                // this.
            }
        }
    }

    stateChanged (state) {
        this.app = state.app
        // console.log(state.config.user)
        this.config = state.config
        const split = state.app.url.split('/')
        // ${ window.location.protocol }//${this.app.registeredUrls[this.url].url}.${window.location.hostname}:${window.location.port}
        // this.url = split[1] === 'q' ? split[2] : 'about:blank'
        // Need to add the port in too, in case it gets hosted not on port 80 or 443
        this.url = split[1] === 'q' ? split[2] : '404'
    }
}

window.customElements.define('show-plugin', ShowPlugin)
