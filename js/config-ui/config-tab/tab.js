import * as helper from '../../helper.js';
/**
 * 여러 요소들을 탭 화면 형식으로 보여주는 커스텀 요소. 
 * 주의: 이 커스텀 요소는 shadow DOM으로 구현하였기에, 이 요소에 삽입할 
 * 다른 요소들은 shadow DOM으로 구현되어 있으면 안된다.
 * @attribute tabname - (자식 요소 속성) 이 탭 요소의 자식 요소의 속성으로 지정. 
 * @attribute on-icon - (자식 요소 속성) 탭 버튼에 텍스트 대신 아이콘을 띄우고 싶은 경우 명시. 속성값 없음.
 * [Google material icon](https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed)을 사용한다.
 * @example 
 * >> <tab-interface>
 * >>     <my-painter tabname="그림판"></my-painter>
 * >>     <my-calculator tabname="계산기"></my-calculator>
 * >>     <my-config tabname="settings" on-icon></my-config>
 * >> </tab-interface>
 */
class TabInterface extends HTMLElement {
    constructor() {
        super();
        this.cssStyle = getComputedStyle(this);
        this.selectedTabBtnIdx = -1;
    }

    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.initElement();
        /*
        helper.waitForRenderingAndExecuteFunctions(
            this.shadowRoot.lastChild,
            [
                [this.constructTabBtns.bind(this)],
                [this.showDisplay.bind(this, 0)],
                [this.setTabBtnColor.bind(this, 0)],
                [this.setEventHandler.bind(this)],
            ]
        )*/
        this.constructTabBtns();
        this.showDisplay(0);
        this.setTabBtnColor(0);
        this.setEventHandler();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="/js/config-ui/config-tab/tab.css">`;
    }

    async _setInnerHTML() {
        return await fetch('/js/config-ui/config-tab/tab.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initElement() {
        this.slottedElements = this.shadowRoot.querySelector('slot').assignedElements();
        /*
        this.slottedElements;
        if (this.shadowRoot.querySelector('slot').assignedElements().length != 0) {
            this.slottedElements = this.shadowRoot.querySelector('slot').assignedElements();
        } else if (this.shadowRoot.querySelector('slot[name="elements"]').assignedElements().length != 0) {
            this.slottedElements = this.shadowRoot.querySelector('slot[name="elements"]').assignedElements();
        } */
        this.tabBtnContainer = this.shadowRoot.querySelector('#tab-btn-container');
        this.tabDisp = this.shadowRoot.querySelector('#tab-display');
    }

    constructTabBtns() {
        if (Object.keys(this.slottedElements).length == 0) {
            return;
        }

        for (let [idx, element] of this.slottedElements.entries()) {
            let tabButton = document.createElement('div');
            if (element.getAttribute('on-icon') != null) {
                tabButton.setAttribute('class', 'tab-button material-symbols-outlined');
            } else {
                tabButton.setAttribute('class', 'tab-button');
            }
            tabButton.setAttribute('slot-idx', idx);

            if (element.getAttribute('tabname')) {
                tabButton.textContent = element.getAttribute('tabname');
            } else if (element.id) {
                tabButton.textContent = element.id;
            } else {
                tabButton.textContent = element.tagName;
            }
            this.tabBtnContainer.append(tabButton);
        }
    }

    clearDisplay() {
        for (let i = 0; i < this.slottedElements.length; i++) {
            this.slottedElements[i].style.display = 'none';
        }
    }

    showDisplay(elementIndex) {
        if (Object.keys(this.slottedElements).length == 0) {
            return;
        }

        this.clearDisplay();
        //this.tabDisp.append(this.slottedElements[elementIndex]);
        this.slottedElements[elementIndex].style.display = 'inline-block';
    }

    setTabBtnColor(slotIdx) {
        // 모든 탭 버튼 색 초기화
        for (let i = 0; i < this.tabBtnContainer.children.length; i++) {
            this.tabBtnContainer.children[i]
                .style.backgroundColor = this.cssStyle.getPropertyValue('--tab-btn-bgcolor');
        }

        // 선택된 탭 버튼만 그 배경색을 변경.
        this.tabBtnContainer.children[slotIdx]
            .style.backgroundColor = this.cssStyle.getPropertyValue('--tab-btn-clicked-bgcolor');
    }

    setEventHandler() {
        function isTargetElement(element) {
            let slotIdx = element.getAttribute('slot-idx');
            try {
                if (element.attributes['class'].nodeValue.split(' ')[0] != 'tab-button'
                || slotIdx == null) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            return true;
        }

        this.tabBtnContainer.addEventListener('click', event => {
            if (!isTargetElement(event.target)) {
                return;
            }

            let slotIdx = event.target.getAttribute('slot-idx');
            this.showDisplay(parseInt(slotIdx));
            this.setTabBtnColor(slotIdx);
            this.selectedTabBtnIdx = slotIdx;
        });

        this.tabBtnContainer.addEventListener('mouseover', event => {
            if (!isTargetElement(event.target) 
            || event.target.getAttribute('slot-idx') == this.selectedTabBtnIdx) {
                return;
            }

            event.target.style.backgroundColor = this.cssStyle.getPropertyValue('--tab-btn-hover-bgcolor');
        });
        this.tabBtnContainer.addEventListener('mouseout', event => {
            if (!isTargetElement(event.target) 
            || event.target.getAttribute('slot-idx') == this.selectedTabBtnIdx) {
                return;
            }

            event.target.style.backgroundColor = this.cssStyle.getPropertyValue('--tab-btn-bgcolor');
        });
    }
}

/**
 * 
 * @param  {...HTMLElement} elements 
 * @returns TabElement
 */
export function createTabElement(...elements) {
    try {
        customElements.define('tab-interface', TabInterface);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    const tabElement = document.createElement('tab-interface');
    for (let element of elements) {
        tabElement.append(element);
    }

    return tabElement;
}
