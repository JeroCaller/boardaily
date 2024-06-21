import { customEventsInfo } from "../custom-events.js";

/**
 * @attribute z-index
 * @example 
 * <config-modal z-index="3"></config-modal>
 */
class ConfigModal extends HTMLElement {
    async connectedCallback() {
        this.initAttribute();
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.setStyleByJs();
        this.initElement();
        this.setEventHandlers();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/config-ui/config-modal.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/config-ui/config-modal.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initAttribute() {
        this.zIndex = this.getAttribute('z-index');
    }

    initElement() {
        this.configModalElement = this.shadowRoot.querySelector('#config-modal');
        this.configContainer = this.shadowRoot.querySelector('#config-container');
    }

    setStyleByJs() {
        if (!this.zIndex) {
            return;
        }

        this.style.position = 'relative';
        this.style.zIndex = this.zIndex;
    }

    setEventHandlers() {
        this.shadowRoot.addEventListener('click', event => {
            if (event.target.id == 'config-container') {
                this.style.display = 'none';
            }
        });
    }
}

/**
 * 
 * @param  {...string[]} attrs ['attr1', 'value1'], ['attr2', 'value2'], ...
 * @returns 
 */
export function createConfigModalElement(...attrs) {
    try {
        customElements.define('config-modal', ConfigModal);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    const configModal = document.createElement('config-modal');

    if (attrs) {
        for (let [attr, value] of attrs) {
            configModal.setAttribute(attr, value);
        }
    }

    return configModal;
}
