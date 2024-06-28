import { customEventsInfo } from "../../custom-events.js";

const imageClickEvent = customEventsInfo["image-container-click"];
imageClickEvent.eventOption = {bubbles: true};

/**
 * - 이미지 컨테이너 내 이미지 클릭 시 "image-container-click"이라는 이벤트가 발생한다. 
 * @example 
 * // img 태그를 자식 요소로 한다.
 * >> <image-container>
 * >>     <img src="...">
 * >>     <img src="...">
 * >> </image-container>
 */
class ImageContainer extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.initElement();
        this.setEventHandler();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/config-ui/image-container/image-container.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/config-ui/image-container/image-container.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initElement() {
        this.imageContainer = this.shadowRoot.querySelector('#image-container');
    }

    setEventHandler() {
        this.imageContainer.addEventListener('click', event => {
            if (event.target.tagName != "IMG") {
                return;
            }
            imageClickEvent.eventDetail = {'img-src': event.target.src};
            document.dispatchEvent(imageClickEvent.getEventObj());
        });
    }
}

export function createImageContainerElement() {
    try {
        customElements.define('image-container', ImageContainer);
    } catch (errorObj) {
        // 커스텀 요소의 재정의 방지.
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('image-container');
}
