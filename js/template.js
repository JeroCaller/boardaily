/**
 * 커스텀 요소 제작 시 사용할 템플릿.
 * 아래 템플릿을 이름만 바꾼채로 사용하여 커스텀 요소를 정의하면 된다.
 */

class YourCustomElement extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="custom-element.css">`;
    }

    async _setInnerHTML() {
        return await fetch('custom-element.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }
}

export function createYourCustomElement() {
    try {
        customElements.define('your-custom-element', YourCustomElement);
    } catch (errorObj) {
        /*
            커스텀 요소의 재정의 방지.
        */
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('your-custom-element');
}
