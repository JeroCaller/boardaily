import * as helper from '../helper.js';

let slotNameForItems = "item-in-menu";

/**
 * @description SideMenu 커스텀 요소의 자식 요소로 활용된다. 하나의 아이템을 담을 때 사용. 
 * \<menu-item\> 태그로 정의하여 사용한다. 
 * @attribute slot - slot="item-in-menu"로 지정한다.
 * @attribute img-src - 이미지 경로
 * @attribute item-name - 아이템 이름
 * @example <menu-item slot="item-in-menu" img-src="이미지경로" item-name="아이템이름"></menu-item>
 */
class MenuItem extends HTMLElement {
    connectedCallback() {
        this.initAttributes();
        this.attachShadow({mode: 'open'}).innerHTML = this._setStyle() + this._setInnerHTML();
    }

    initAttributes() {
        this.imgSrc = this.getAttribute('img-src');
        this.itemName = this.getAttribute('item-name');
    }

    _setStyle() {
        return `<style>
            :host {
                --item-content-height: 1.2em;
                --add-size: 0.5em;
                font-size: var(--item-content-height);
                display: flex;
                align-items: center;
                height: 1em;
                padding: 1em;
            }
            :host(:hover) {
                background-color: #AD88C6;
                cursor: pointer;
            }
            a {
                width: 100%;
                text-decoration: none;
                color: #FFE6E6;
                display: flex;
                align-items: center;
            }
            a > img {
                width: calc(var(--item-content-height) + var(--add-size));
                margin-right: 1em;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<a href="/html/table.html#${helper.extractFileName(this.imgSrc)}">
            <img src="${this.imgSrc}"></custom-img>
            <span>${this.itemName}</span>
        </a>`;
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
        this.getWidthAttr();
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndHTML();
    }

    getWidthAttr() {
        this.width = this.getAttribute('width');
        if (this.width == null) {
            this.width = '100%';
        }
    }

    /**
     * @description this.styleString에 <style> 태그를 이용하여 shadow DOm 스타일 지정
     */
    _setStyle() {
        this.styleString = `<style>
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
            :host {
                --background-color: #7469B6;
                --menu-icon-size: 2em;
                display: flex;
                width: ${this.width};
                transform: translateX(calc(-${this.width} + var(--menu-icon-size)));
            }
            :host(:hover) {
                transform: translateX(0);
                transition: transform 0.5s;
            }
            :host(:not(:hover)) {
                /* 해당 요소에서 마우스가 떠났을 때 메뉴 닫히는 모션이 부드럽게 진행되도록 함 */
                transform: translateX(calc(-${this.width} + var(--menu-icon-size)));
                transition: transform 0.5s;
            }
            #item-container {
                width: ${this.width};
                background-color: var(--background-color);
            }
            #menu-icon {
                width: var(--menu-icon-size);
                height: var(--menu-icon-size);
                background-color: var(--background-color);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #menu-icon:hover {
                cursor: pointer;
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
    newSideMenu.setAttribute('width', '18em');

    let toolsJson = await helper.getToolInfoInJson();
    for(let i = 0; i < toolsJson.length; i++) {
        let imgSrc = toolsJson[i]["img-src"];
        newSideMenu.insertAdjacentHTML('beforeend', `<menu-item 
        slot="${slotNameForItems}"
        img-src="${imgSrc}"
        item-name="${toolsJson[i]["name"]}"
        ></menu-item>
        `);
    }

    return newSideMenu;
}