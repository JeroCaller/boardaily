import * as calcLogic from "./calculator-logic.js";
import * as helper from '../../helper.js';

class CalcDisplayer extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await this.combineStyleAndHTML();
        this.setStyleInJs();
    }

    async _setStyle() {
        return `<style>${await fetch('/js/table-page/calculator/calculator-display.css').then(res => res.text())}</style>`;
    }

    setStyleInJs() {
        this.querySelectorAll('input').forEach((element) => {
            element.style.fontSize = this.getAttribute('font-size');
        });
    }

    _setInnerHTML() {
        return  `<div id="text-container">
            <input type="text" id="input-status" readonly>
            <input type="text" id="result" readonly>
        </div>`
    }

    async combineStyleAndHTML() {
        return await this._setStyle() + this._setInnerHTML();
    }
}

/**
 * @description Calculator 컴포넌트를 구성하느 버튼 요소 클래스.
 * @attribute value - 버튼에 나타낼 텍스트.
 * @example
 * <custom-calculator>
 *   <calc-button value="3"></calc-button>
 * </custom-calculator>
 */
class CalcButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `${this.getAttribute('value')}`;
        if (this.getAttribute('value') == '<-') {
            this.setAttribute('class', 'material-symbols-outlined');
            this.innerHTML = 'backspace';
        }
    }
}

class Calculator extends HTMLElement {
    displayFontSize = '2em';

    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        helper.waitForRenderingAndExecuteFunctions(
            this.shadowRoot.querySelector('calc-displayer'),
            [
                [this._initElementVars.bind(this)],
                [this._setEventHandlers.bind(this)],
                [this._setKeyboardEventHandler.bind(this)],
            ]
        );
    }

    async _setStyle() {
        let cssStr = await fetch('/js/table-page/calculator/calculator.css').then(res => res.text());
        return `<style>${cssStr}</style>`;
    }

    _setInnerHTML() {
        let iHTML = `<calc-displayer font-size="${this.displayFontSize}"></calc-displayer>`;
        iHTML += this._constructKeyPads();
        return iHTML;
    }

    async combineStyleAndHTML() {
        let result = await this._setStyle();
        result += this._setInnerHTML();
        return result;
    }

    _constructKeyPads() {
        let padHTML = ``;
        let btnValues = [
            "C", "()", "%", "/",
            "7", "8", "9", "X",
            "4", "5", "6", "-",
            "1", "2", "3", "+",
            "<-", "0", ".", "="
        ];
        for(let val of btnValues) {
            padHTML += `<calc-button value="${val}"></calc-button>`;
        }
        return padHTML;
    }

    _initElementVars() {
        this.calcInputDisp = this.shadowRoot.querySelector('calc-displayer > #text-container > #input-status');
        this.calcResultDisp = this.shadowRoot.querySelector('calc-displayer > #text-container > #result');
        this.calcBtns = this.shadowRoot.querySelectorAll('calc-button');
    }

    _setEventHandlers() {
        for (let oneBtn of this.calcBtns) {
            switch (oneBtn.getAttribute('value')) {
                case '<-':
                    oneBtn.addEventListener('click', () => {
                        if (this.calcInputDisp.value.length <= 0) {
                            return;
                        }
                        this.calcInputDisp.value = this.calcInputDisp.value.substring(0, this.calcInputDisp.value.length-1);
                        this.calcResultDisp.value = '';
                    });
                    break;
                case 'C':
                    oneBtn.addEventListener('click', () => {
                        this.calcInputDisp.value = '';
                        this.calcResultDisp.value = '';
                    });
                    break;
                case '=':
                    oneBtn.addEventListener('click', () => {
                        if (!this.calcInputDisp.value) {
                            // 아무런 값도 입력되지 않았다면 패스.
                            return;
                        }
                        this.calcResultDisp.value = calcLogic.calculateExpression(
                            calcLogic.replacePercent(
                                calcLogic.autoFillParenthesis(this.calcInputDisp.value)
                            )
                        );
                        this.calcInputDisp.value = calcLogic.autoFillParenthesis(this.calcInputDisp.value);
                    });
                    break;
                case '()':
                    oneBtn.addEventListener('click', () => {
                        this.calcInputDisp.value += calcLogic.addWhichParenthesis(this.calcInputDisp.value);
                    });
                    break;
                case 'X':
                    oneBtn.addEventListener('click', () => this.calcInputDisp.value += '*');
                    break;
                default:
                    oneBtn.addEventListener('click', event => {
                        this.calcInputDisp.value += event.target.innerText;
                        /*
                            텍스트의 길이가 디스플레이의 정해진 길이를 넘어갈 경우, 맨 마지막 문자가 디스플레이의 
                            맨 오른쪽에 오도록 위치시킨다. 이 경우, 텍스트의 왼쪽에 위치한 문자들은 디스플레이에서 
                            잘려 보이지 않는다. 다만 이 경우, 키보드의 왼쪽 화살표 키를 누르면 잘린 문자들을 다시 볼 수 있다. 
                        */
                        this.calcInputDisp.setSelectionRange(this.calcInputDisp.value.length, this.calcInputDisp.value.length);
                        this.calcInputDisp.scrollLeft = this.calcInputDisp.value.length * parseInt(this.displayFontSize[0]) * 16;
                    });
            }
        }
    }

    _setKeyboardEventHandler() {
        document.addEventListener('keydown', event => {
            let whatKey = event.key;
            // 키보드로 입력된 문자를 커스텀 계산기가 이해할 수 있는 문자로 변형.
            switch (whatKey) {
                case "Backspace":
                    whatKey = "<-";
                    break;
                case "*":
                    whatKey = "X";
                    break;
                case "Delete":
                    whatKey = "C";
                    break;
                case "(":
                case ")":
                    whatKey = "()";
                    break;
                case "Enter":
                    whatKey = "=";
            }
            for (let oneBtn of this.calcBtns) {
                if (whatKey == oneBtn.getAttribute('value')) {
                    oneBtn.dispatchEvent(new Event('click'));
                }
            }
        });
    }
}

export function createCalcElement() {
    try {
        customElements.define('calc-displayer', CalcDisplayer);
        customElements.define('calc-button', CalcButton);
        customElements.define('custom-calculator', Calculator);
    } catch (errObj) {
        if (!errObj instanceof DOMException) {
            throw errObj;
        }
    }

    let calculatorElement = document.createElement('custom-calculator');

    return calculatorElement;
}
