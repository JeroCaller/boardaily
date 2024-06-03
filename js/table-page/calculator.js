class CalcDisplayer extends HTMLElement {}

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
        if(this.getAttribute('value') == '<-') {
            this.setAttribute('class', 'material-symbols-outlined');
            this.innerHTML = 'backspace';
        }
    }
}

class Calculator extends HTMLElement {
    letterMaxSize = 17;

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
                
                display: grid;
                grid-template-columns: repeat(4, calc(var(--button-size) * 2));
                gap: 0.1em 0.2em;
                border: 3px solid black;
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
                width: 100%;
                height: 3em;
                background-color: #B5C18E;
                grid-column: 1/5;
                border: 1px solid black;
                font-size: 2em;
                padding: 0.3em;
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
        let iHTML = `<calc-displayer></calc-displayer>`;
        iHTML += this._constructKeyPads();
        return iHTML;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
    }

    _constructKeyPads() {
        let padHTML = ``;
        let btnValues = [
            "%", "C", "CE", "/",
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
        const calcDisp = this.shadowRoot.querySelector('calc-displayer');
        const calcBtns = this.shadowRoot.querySelectorAll('calc-button');
        for (let oneBtn of calcBtns) {
            switch (oneBtn.getAttribute('value')) {
                case '<-':
                    oneBtn.addEventListener('click', () => {
                        if(calcDisp.innerText.length <= 0) {
                            return;
                        }
                        calcDisp.innerText = calcDisp.innerText.substring(0, calcDisp.innerText.length-1);
                    });
                    break;
                case 'C':
                    oneBtn.addEventListener('click', () => calcDisp.innerText = '');
                    break;
                default:
                    oneBtn.addEventListener('click', event => {
                        if(calcDisp.innerText.length == this.letterMaxSize) {
                            return;
                        }
                        calcDisp.innerText += event.target.innerText;
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
