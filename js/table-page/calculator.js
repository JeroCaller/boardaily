import * as calcLogic from "./calculator-logic.js";

class CalcDisplayer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<style>
            input {
                width: 98%;
                background-color: rgba(0, 0, 0, 0);
                font-size: ${this.getAttribute('font-size')};
            }
        </style>
        <div id="text-container">
            <input type="text" id="input-status" readonly>
            <input type="text" id="result" readonly>
        </div>`;
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

    connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndHTML();
        this._setEventHandlers();
    }

    _setStyle() {
        return `<style>
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
            :host {
                --button-size: 2.5em;
                --button-font-size: 2em;
                --gap-column: 0.2em;
                --button-column-number: 4;
                
                display: grid;
                grid-template-columns: repeat(var(--button-column-number), calc(var(--button-size) * 2));
                gap: 0.1em var(--gap-column);
                border: 3px solid black;
                width: calc(var(--button-size) * 2 * var(--button-column-number) + var(--gap-column) * calc(var(--button-column-number) - 1));
                padding: 0.5em;
            }
            calc-button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: var(--button-size);
                height: var(--button-size);
                border: 1px solid black;
                background-color: #EADBC8;
                font-size: var(--button-font-size);
            }
            calc-button:hover {
                cursor: pointer;
                background-color: #C7B7A3;
            }
            calc-displayer {
                width: 100.6%;
                height: 5.5em;
                background-color: #B5C18E;
                grid-column: 1/5;
                border: 1px solid black;
                padding: 0.1em;
                box-sizing: border-box;
            }
            .material-symbols-outlined {
                font-size: var(--button-font-size);
                display: flex;
                justify-content: center;
                align-items: center;
            }
        </style>`;
    }

    _setInnerHTML() {
        let iHTML = `<calc-displayer font-size="${this.displayFontSize}"></calc-displayer>`;
        iHTML += this._constructKeyPads();
        return iHTML;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
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

    _setEventHandlers() {
        const calcInputDisp = this.shadowRoot.querySelector('calc-displayer > #text-container > #input-status');
        const calcResultDisp = this.shadowRoot.querySelector('calc-displayer > #text-container > #result');
        const calcBtns = this.shadowRoot.querySelectorAll('calc-button');
        for (let oneBtn of calcBtns) {
            switch (oneBtn.getAttribute('value')) {
                case '<-':
                    oneBtn.addEventListener('click', () => {
                        if (calcInputDisp.value.length <= 0) {
                            return;
                        }
                        calcInputDisp.value = calcInputDisp.value.substring(0, calcInputDisp.value.length-1);
                        calcResultDisp.value = '';
                    });
                    break;
                case 'C':
                    oneBtn.addEventListener('click', () => {
                        calcInputDisp.value = '';
                        calcResultDisp.value = '';
                    });
                    break;
                case '=':
                    oneBtn.addEventListener('click', () => {
                        if (!calcInputDisp.value) {
                            // 아무런 값도 입력되지 않았다면 패스.
                            return;
                        }
                        calcResultDisp.value = calcLogic.calculateExpression(
                            calcLogic.autoFillParenthesis(calcInputDisp.value)
                        );
                        calcInputDisp.value = calcLogic.autoFillParenthesis(calcInputDisp.value);
                    });
                    break;
                case '()':
                    oneBtn.addEventListener('click', () => {
                        calcInputDisp.value += calcLogic.addWhichParenthesis(calcInputDisp.value);
                    });
                    break;
                case 'X':
                    oneBtn.addEventListener('click', () => calcInputDisp.value += '*');
                    break;
                default:
                    oneBtn.addEventListener('click', event => {
                        calcInputDisp.value += event.target.innerText;
                        /*
                            텍스트의 길이가 디스플레이의 정해진 길이를 넘어갈 경우, 맨 마지막 문자가 디스플레이의 
                            맨 오른쪽에 오도록 위치시킨다. 이 경우, 텍스트의 왼쪽에 위치한 문자들은 디스플레이에서 
                            잘려 보이지 않는다. 다만 이 경우, 키보드의 왼쪽 화살표 키를 누르면 잘린 문자들을 다시 볼 수 있다. 
                        */
                        calcInputDisp.setSelectionRange(calcInputDisp.value.length, calcInputDisp.value.length);
                        calcInputDisp.scrollLeft = calcInputDisp.value.length * parseInt(this.displayFontSize[0]) * 16;
                    });
            }
        }
    }
}

export function createCalcElement() {
    customElements.define('calc-displayer', CalcDisplayer);
    customElements.define('calc-button', CalcButton);
    customElements.define('custom-calculator', Calculator);

    let calculatorElement = document.createElement('custom-calculator');

    return calculatorElement;
}
