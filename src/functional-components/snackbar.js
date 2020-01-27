import { LitElement, html, css } from 'lit-element'

let queueElement

const queue = []

class SnackQueue extends LitElement {
    static get properties () {
        return {
            busy: {
                type: Boolean,
                attribute: 'busy',
                reflectToAttribute: true
            },
            currentSnack: {
                type: Object,
                attribute: 'current-snack',
                reflectToAttribute: true
            }
        }
    }

    static get styles() {
        return css``
    }

    render () {
        return html`
            <mwc-snackbar id="snack" labelText="${this._labelText}" ?stacked=${this.stacked} ?leading=${this.leading} ?closeOnEscape=${this.closeOnEscape} timeoutMs=${this._timeoutMs}>
                ${this._action ? html`
                    <mwc-button slot="action">${this._actionText}</mwc-button>
                ` : '' }
                ${this._dismiss ? html`
                    <mwc-icon-button icon="${this._dismissIcon}" slot="dismiss"></mwc-icon-button>
                ` : ''}
            </mwc-snackbar>
        `
    }

    firstUpdated () {
        this._snackbar = this.shadowRoot.getElementById('snack')
    }

    _shift () {
        if (this.busy || queue.length === 0) return

    }

    add (item) {
        this.queue.push(item)
        this._shift()
    }
}

window.customElements.define('snack-queue', SnackQueue)

const queueNode = document.createElement('snack-queue')
queueNode.id = 'queue-node'
queueNode.loadingMessage = ''
queueElement = document.body.appendChild(queueNode)
setTimeout(() => {
    const queueElement = document.getElementById('queue-node')
    const mainApp = document.getElementById('main-app')
    const shadow = mainApp.shadowRoot
    queueElement = shadow.appendChild(queueElement)
}, 500) // Should just keep checking for the main-app and it's shadow and then append once it's there
export default queueElement
