/* copied from https://github.com/Orlandster/wc-typed-js/blob/master/src/typed.js */

import { LitElement, html } from 'lit-element'
import Typed from 'typed.js'

export class TypedJS extends LitElement {
    static get properties () {
        return {
            strings: { type: String },
            stringsElement: { type: String },
            typeSpeed: { type: Number },
            startDelay: { type: Number },
            backSpeed: { type: Number },
            smartBackspace: { type: Boolean },
            shuffle: { type: Boolean },
            backDelay: { type: Number },
            fadeOut: { type: Boolean },
            fadeOutClass: { type: String },
            fadeOutDelay: { type: Boolean },
            loop: { type: Boolean },
            loopCount: { type: Number },
            showCursor: { type: Boolean },
            cursorChar: { type: String },
            autoInsertCss: { type: Boolean },
            attr: { type: String },
            bindInputFocusEvents: { type: Boolean },
            contentType: { type: String }
        }
    }

    render () {
        this.typed = new Typed(this.querySelector('.typing'), {
            strings: this.strings.split(',') || '',
            stringsElement: this.stristringsElementngs || null,
            typeSpeed: this.typeSpeed || 50,
            startDelay: this.startDelay || 0,
            backSpeed: this.backSpeed || 0,
            smartBackspace: this.smartBackspace || true,
            shuffle: this.shuffle || false,
            backDelay: this.backDelay || 700,
            fadeOut: this.fadeOut || false,
            fadeOutClass: this.fadeOutClass || false,
            fadeOutDelay: this.fadeOutDelay || false,
            loop: this.loop || false,
            loopCount: this.loopCount || Infinity,
            showCursor: this.showCursor || true,
            cursorChar: this.cursorChar || '|',
            autoInsertCss: this.autoInsertCss || true,
            attr: this.attr || null,
            bindInputFocusEvents: this.bindInputFocusEvents || false,
            contentType: this.contentType || 'html',
            onComplete: typed => {
                const complete = new CustomEvent('complete', {
                    detail: { typed },
                    bubbles: true,
                    composed: true
                })
                this.dispatchEvent(complete)
            }
        })

        console.log(this.typed)

        return html`
            <slot></slot>
        `
    }
}

window.customElements.define('wc-typed-js', TypedJS)
