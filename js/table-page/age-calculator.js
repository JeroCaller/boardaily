import * as ageCalcLogic from './age-calculator-logic.js';

/**
 * @attribute for
 * @attribute input-type
 * @attribute label-text
 * @example <labeled-input for="id-input" input-type="text" label-text="input your id"></labeled-input>
 */
class LabeledInput extends HTMLElement {
    connectedCallback() {
        this._initAttr();
        this.innerHTML = this.combineStyleAndInnerHTML();
        this.setExtraAttributes();
    }

    _setStyle() {
        return `<style>
            .label-input-container > label {
                display: block;
                text-align: center;
                margin-bottom: 0.5em;
                font-size: 1.5em;
            }
            .label-input-container > input {
                width: 5em;
                font-size: 1.5em;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<div class="label-input-container">
            <label for="${this.forAttr}">${this.labelText}</label>
            <input type="${this.getAttribute('input-type')}" id="${this.forAttr}">
        </div>`;
    }

    combineStyleAndInnerHTML() {
        return this._setStyle() + this._setInnerHTML();
    }

    _initAttr() {
        this.forAttr = this.getAttribute('for');
        this.labelText = this.getAttribute('label-text');
        if (!this.labelText) {
            this.labelText = '';
        }
    }

    /**
     * 이 커스텀 태그에 사용자가 추가적으로 속성을 추가한 경우, 추가 속성을 모두 
     * input 태그의 속성으로 간주하고 해당 태그에 속성을 추가한다. 
     */
    setExtraAttributes() {
        const excludeAttr = ['for', 'input-type', 'label-text'];
        const inputElement = this.querySelector('input');

        // Reflect.ownKeys(객체) :  객체 프로퍼티의 키들을 배열 형태로 반환.
        Reflect.ownKeys(this.attributes).forEach(attr => {
            if (excludeAttr.includes(attr) || !isNaN(attr)) {
                // 결과값인 배열에 키가 숫자인 프로퍼티도 있는데, 이는 불필요한 정보이므로 필터링한다. 
                return;
            }
            inputElement.setAttribute(attr, this.getAttribute(attr));
        });
    }
}

class AgeResultDisplayer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = this.combineStyleAndInnerHTML();
    }

    _initAttr() {
        this.birthDate = this.getAttribute('birth-date');
    }

    _setStyle() {
        return `<style>
            #age-result-container > div {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #age-result-container > div > .label {
                background-color: #80B9AD;
                padding: 1em;
            }
            #age-result-container > div > .result {
                width: 10em;
                padding: 1em;
                background-color: #B3E2A7;
                text-align: center;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<div id="age-result-container">
            <div id="age-international">
                <span class="label">만 나이</span>
                <p class="result"></p>
            </div>
            <div id="age-this-year">
                <span class="label">연 나이</span>
                <p class="result"></p>
            </div>
            <div id="age-korean">
                <span class="label">한국식 나이</span>
                <p class="result"></p>
            </div>
        </div>`;
    }

    combineStyleAndInnerHTML() {
        return this._setStyle() + this._setInnerHTML();
    }
}

class AgeCalculator extends HTMLElement {
    constructor() {
        super();
        this.todayDate = new Date();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndInnerHTML();
        this._initElementVars();
        this.updateCurrentDate();
        this._setEventHandler();
        this._setKeyboardEventHandler();
    }

    _setStyle() {
        return `<style>
            :host > * {
                margin-bottom: 3em;
            }
            #age-input {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #6295A2;
                padding: 1em;
            }
            #age-input > labeled-input {
                margin-right: 1em;
            }
            input[id="birth-date"] {
                font-size: 1em;
                padding: 1em;
                background-color: #B3E2A7;
                border-width: 0;
                border-radius: 0.4em;
                cursor: pointer;
            }
            input[id="birth-date"]:hover {
                background-color: #B3E2A799;
            }
            input[id="birth-date"]:active {
                background-color: #538392;
            }
            #current-date, #message, #explain {
                width: 100%;
                padding: 1em;
                box-sizing: border-box;
                border: 1px solid black;
                background-color: #D8EFD3;
            }
            #current-date, #message {
                font-size: 1.5em;
                text-align: center;
                margin-bottom: 2em;
            }
            #message{
                font-size: 1em;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<div id="age-input">
            <labeled-input 
            for="year" 
            input-type="number" 
            label-text="연도" 
            placeholder="ex) 1990"
            min="0"></labeled-input>
            <labeled-input 
            for="month" 
            input-type="number" 
            label-text="월" 
            placeholder="ex) 07"
            min="0"
            max="12"></labeled-input>
            <labeled-input 
            for="day" 
            input-type="number" 
            label-text="일" 
            placeholder="ex) 09"
            min="0"
            max="31"></labeled-input>
            <input type="button" value="생년월일 입력" id="birth-date">
        </div>
        <div id="current-date">
            <span id="current-date-label">현재 날짜: </span>
            <span id="current-date-result"></span>
        </div>
        <section id="message"></section>
        <div><age-result></age-result></div>
        <section id="explain">
            <ul>
                <li>생년월일의 연도, 월, 일을 모두 입력해주세요.</li>
            </ul>
        </section>`;
    }

    combineStyleAndInnerHTML() {
        return this._setStyle() + this._setInnerHTML();
    }

    _initElementVars() {
        this.btn = this.shadowRoot.querySelector('#birth-date');
        this.inputTexts = this.shadowRoot.querySelectorAll('labeled-input');
        this.messageDisp = this.shadowRoot.querySelector('#message');

        this.ageResult = this.shadowRoot.querySelector('age-result');
        this.ageInterDisp = this.ageResult.querySelector('#age-international > p');
        this.ageYearDisp = this.ageResult.querySelector('#age-this-year > p');
        this.ageKoreanDisp = this.ageResult.querySelector('#age-korean > p');
    }

    getCurrentDate() {
        this.todayDate = new Date();
        return this.todayDate;
    }

    updateCurrentDate() {
        this.getCurrentDate();
        this.shadowRoot.querySelector('#current-date-result').innerText = this.todayDate.toLocaleDateString();
        this.shadowRoot.querySelector('labeled-input[for="year"]').setAttribute('max', this.todayDate.getFullYear());
    }

    _setEventHandler() {
        this.btn.addEventListener('click', () => this.updateCurrentDate());
        this.btn.addEventListener('click', () => {
            this.messageDisp.innerText = '';

            let dateArr = [];
            for (let element of this.inputTexts) {
                dateArr.push(element.querySelector('input').value);
            }

            let notValidMsg = {
                0: "연도는 반드시 입력해야합니다.",
                1: "월을 입력해주세요.",
                2: "일을 입력해주세요."
            };
            for (let i = 0; i < dateArr.length; i++) {
                if(!dateArr[i]) {
                    this.messageDisp.innerText = notValidMsg[i];
                    this.ageInterDisp.innerText = '';
                    this.ageYearDisp.innerText = '';
                    this.ageKoreanDisp.innerText = '';
                    return;
                }
            }

            if (ageCalcLogic.convertStrToDate(dateArr) > this.todayDate) {
                this.messageDisp.innerText = "생년월일은 현재 날짜보다 이전 날짜여야 합니다.";
                this.ageInterDisp.innerText = '';
                this.ageYearDisp.innerText = '';
                this.ageKoreanDisp.innerText = '';
                return;
            }

            let calcObj = new ageCalcLogic.CalculateAge(dateArr, this.todayDate);
            if (isNaN(calcObj.getInternationalAge())) {
                this.messageDisp.innerText = "유효하지 않은 입력입니다. 생년월일은 현재 날짜보다 이전이어야 하며, 월은 1~12 사이, 일은 1~31 사이로 입력하셔야 합니다.";
                return;
            }
            this.ageInterDisp.innerText = calcObj.getInternationalAge() + '세';
            this.ageYearDisp.innerText = calcObj.getYearAge() + '세';
            this.ageKoreanDisp.innerText = calcObj.getKoreanAge() + '세';
        });
    }

    _setKeyboardEventHandler() {
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case "Enter":
                    this.btn.dispatchEvent(new Event('click'));
                    break;
            }
        });
    }
}

export function createAgeCalcElement() {
    try {
        customElements.define('age-result', AgeResultDisplayer);
        customElements.define('labeled-input', LabeledInput);
        customElements.define('age-calculator', AgeCalculator);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    let ageCalcElement = document.createElement('age-calculator');
    return ageCalcElement;
}
