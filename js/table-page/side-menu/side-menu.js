import * as helper from '../../helper.js';
import { createConfigIcon } from '../../config-ui/config-result.js';

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
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndHTML();
        this.setEventHandler();
    }

    initAttributes() {
        this.imgSrc = this.getAttribute('img-src');
        this.itemName = this.getAttribute('item-name');
    }

    _setStyle() {
        return '<link rel="stylesheet" href="/js/table-page/side-menu/menu-item.css">';
    }

    _setInnerHTML() {
        return `<a href="/html/table.html#${helper.extractFileName(this.imgSrc)}">
            <img src="${this.imgSrc}"></img>
            <span>${this.itemName}</span>
        </a>`;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
    }

    setEventHandler() {
        /* 
            a 태그 적용에도 간혹 url에 반영이 안될 떄가 있어 다음 코드를 추가함.
            location.hash : url의 fragment(# 달린 거)를 읽어오거나 쓸 수 있는 프로퍼티.
        */
        this.addEventListener('click', () => {
            location.hash = `#${helper.extractFileName(this.imgSrc)}`;
        });
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
        this._setStyleByJS();
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
        return '<link rel="stylesheet" href="/js/table-page/side-menu/side-menu.css">';
    }

    _setStyleByJS() {
        this.style.width = this.width;
        this.style.transform = `translateX(calc(-${this.width} + var(--menu-icon-size)))`;
        this.shadowRoot.querySelector('#item-container').style.width = this.width;
        this.addEventListener('mouseenter', () => {
            this.style.transform = `translateX(0)`;
            /*
                transition 속성을 addEventListener 바깥에 선언하면 
                메인 페이지에서 table.html으로 이동할 떄, 사이드 메뉴가 보여지는 상태에서 
                왼쪽으로 사라지는 현상이 발생함. 원래는 처음부터 사이드 메뉴가 보여지지 않아야 함. 
                해당 속성을 mouseenter, mouseleave 둘 중 한 이벤트에만 부착하는 경우, 사이드 메뉴 
                움직임에 에니메이션 효과가 추가되지 않아 갑자기 움직이는 것 같은 현상이 발생함.
                그래서 어쩔 수 없이 코드가 중복되어 보여도 해당 속성을 두 이벤트 모두에 일일이 집어넣을 수 밖에 없음.
             */
            this.style.transition = `transform 0.5s`;
        });
        this.addEventListener('mouseleave', () => {
            this.style.transform = `translateX(calc(-${this.width} + var(--menu-icon-size)))`;
            this.style.transition = `transform 0.5s`;
        });
    }

    /**
     * @description this.htmlString에 이 메뉴 요소 내부의 HTML 코드 작성.
     */
    _setinnerHTML() {
        return `<div id="item-container">
            <slot></slot>
            <slot name="${slotNameForItems}"></slot>
        </div>
        <div id="menu-icon" class="material-symbols-outlined">menu</div>`;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setinnerHTML();
    }
}

export async function createSideMenu() {
    customElements.define('side-menu', SideMenu);
    customElements.define('menu-item', MenuItem);
    
    let newSideMenu = document.createElement('side-menu');
    newSideMenu.setAttribute('width', '18em');

    newSideMenu.append(createConfigIcon());

    const tools = await helper.toolsInfo;
    for(let prop in tools) {
        let imgSrc = tools[prop]["img-src"];
        newSideMenu.insertAdjacentHTML('beforeend', `<menu-item 
        slot="${slotNameForItems}"
        img-src="${imgSrc}"
        item-name="${tools[prop]["name"]}"
        ></menu-item>
        `);
    }

    return newSideMenu;
}
