import * as helper from '../helper.js';

let slotNameForItems = "item-in-menu";

/**
 * @description SideMenu 커스텀 요소의 자식 요소로 활용된다. 하나의 아이템을 담을 때 사용. 
 * \<menu-item\> 태그로 정의하여 사용한다. 
 * @attribute slot - slot="item-in-menu"로 지정한다.
 */
class MenuItem extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = `<style>
            :host(:hover) {
                background-color: blue;
            }
            :host {
                --item-content-height: 1.2em;
                color: beige;
                font-size: var(--item-content-height);
                display: flex;
                height: 1em;
                padding: 1em;
            }
            ::slotted(div) {
                display: inline-block;
                width: var(--item-content-height);
                height: var(--item-content-height);
                background-image: url('${this.firstElementChild.getAttribute('src')}');
                background-size: cover;
                margin-right: 1em;
            }
        </style>
        <slot></slot>`;
    }
}

/**
 * @example
 * // in HTML
    <side-menu>
        <menu-item slot="item-in-menu">calculator</menu-item>
        <menu-item slot="item-in-menu">todo list</menu-item>
        <menu-item slot="item-in-menu">watch</menu-item>
    </side-menu>
 */
class SideMenu extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndHTML();
    }

    /**
     * @description this.styleString에 <style> 태그를 이용하여 shadow DOm 스타일 지정
     */
    _setStyle() {
        this.styleString = `<style>
            :host {
                display: flex;
                width: 100%;
            }
            #item-container {
                width: 100%;
                background-color: #c73659;
            }
            #menu-icon {
                width: 4em;
                height: 4em;
                background-color: #c73659;
            }
        </style>`;
    }

    /**
     * @description this.htmlString에 이 메뉴 요소 내부의 HTML 코드 작성.
     */
    _setinnerHTML() {
        this.htmlString = `
        <div id="item-container">
            <slot name="${slotNameForItems}"></slot>
        </div>
        <div id="menu-icon" class="material-symbols-outlined">menu</div>`;
    }

    combineStyleAndHTML() {
        this._setStyle();
        this._setinnerHTML();
        return this.styleString + this.htmlString;
    }
}

export async function createSideMenu() {
    customElements.define('side-menu', SideMenu);
    customElements.define('menu-item', MenuItem);
    
    let newSideMenu = document.createElement('side-menu');
    let toolsJson = await helper.getToolInfoInJson();
    for(let i = 0; i < toolsJson.length; i++) {
        let imgSrc = toolsJson[i]["img-src"];
        newSideMenu.insertAdjacentHTML('beforeend', `<menu-item slot="${slotNameForItems}">
            <div id="#${helper.extractFileName(imgSrc)}" src="${imgSrc}"></div>
            <span>${toolsJson[i]["name"]}</span>
        </menu-item>
        `);
    }

    return newSideMenu;
}