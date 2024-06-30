/**
 * @attribute z-index
 * @attribute mode - "config", "message" 중 하나를 기입. 
 * @example 
 * <modal-window z-index="3" mode="config"></modal-window>
 */
class ModalWindow extends HTMLElement {
    async connectedCallback() {
        this.initAttribute();
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.initElement();
        this.setStyleByJs();
        switch (this.modeStr) {
            case "config":
                this.initConfigWindow();
                break;
            default:
            case "message":
                this.initMsgWindow();
                break;
        }
        this.setEventHandlers();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/modal/modal.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/modal/modal.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initAttribute() {
        this.zIndex = this.getAttribute('z-index');
        this.modeStr = this.getAttribute('mode');
        if (!this.modeStr) {
            this.modeStr = "message";
        }
    }

    initElement() {
        this.modalMain = this.shadowRoot.querySelector('#modal-main');
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
            if (event.target.id == 'modal-container') {
                this.style.display = 'none';
            }
        });
    }

    /**
     * 모달 창을 메세지 창으로 초기화.
     */
    initMsgWindow() {
        const btnConfirm = document.createElement('input');
        btnConfirm.setAttribute('type', 'button');
        btnConfirm.setAttribute('value', "확인");
        btnConfirm.setAttribute('id', 'btn-confirm');
        btnConfirm.addEventListener('click', () => this.style.display = 'none');
        this.modalMain.append(btnConfirm);
    }

    /**
     * 모달 창을 설정 창으로 초기화
     */
    initConfigWindow() {
        const btnExit = document.createElement('input');
        btnExit.setAttribute('type', 'button');
        btnExit.setAttribute('id', 'btn-exit');
        btnExit.setAttribute('class', 'material-symbols-outlined');
        btnExit.setAttribute('value', 'close');
        btnExit.addEventListener('click', () => this.style.display = 'none');
        this.modalMain.insertAdjacentElement('afterbegin', btnExit);
    }
}

/**
 * 
 * @param  {...string[]} attrs ['attr1', 'value1'], ['attr2', 'value2'], ...
 * @returns 
 */
export function createModalWindowElement(...attrs) {
    try {
        customElements.define('modal-window', ModalWindow);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    const modalWindow = document.createElement('modal-window');

    if (attrs) {
        for (let [attr, value] of attrs) {
            modalWindow.setAttribute(attr, value);
        }
    }

    return modalWindow;
}
