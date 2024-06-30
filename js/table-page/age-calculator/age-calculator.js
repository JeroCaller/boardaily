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
        return `<link rel="stylesheet" href="js/table-page/age-calculator/labeled-input.css">`;
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

class AgeCalculator extends HTMLElement {
    constructor() {
        super();
        this.todayDate = new Date();
    }

    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndInnerHTML();
        this._initElementVars(); 
        this.updateCurrentDate();
        this._setEventHandler();
        this._setKeyboardEventHandler();
    }

    _setStyle() {
        return '<link rel="stylesheet" href="js/table-page/age-calculator/age-calculator.css">';
    }

    async _setInnerHTML() {
        return await fetch('js/table-page/age-calculator/age-calculator.html').then(res => res.text());
    }

    async combineStyleAndInnerHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    _initElementVars() {
        this.btn = this.shadowRoot.querySelector('#birth-date');
        this.inputTexts = this.shadowRoot.querySelectorAll('labeled-input');
        this.messageDisp = this.shadowRoot.querySelector('#message');

        this.ageInterDisp = this.shadowRoot.querySelector('#age-international > p');
        this.ageYearDisp = this.shadowRoot.querySelector('#age-this-year > p');
        this.ageKoreanDisp = this.shadowRoot.querySelector('#age-korean > p');
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

    clearAgeResult() {
        this.ageInterDisp.innerText = '';
        this.ageYearDisp.innerText = '';
        this.ageKoreanDisp.innerText = '';
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
                    this.clearAgeResult();
                    return;
                }
            }

            if (ageCalcLogic.convertStrToDate(dateArr) > this.todayDate) {
                this.messageDisp.innerText = "생년월일은 현재 날짜보다 이전 날짜여야 합니다.";
                this.clearAgeResult();
                return;
            }

            let calcObj = new ageCalcLogic.CalculateAge(dateArr, this.todayDate);
            if (isNaN(calcObj.getInternationalAge())) {
                this.messageDisp.innerText = "유효하지 않은 입력입니다. 생년월일은 현재 날짜보다 이전이어야 하며, 월은 1~12 사이, 일은 1~31 사이로 입력하셔야 합니다.";
                this.clearAgeResult();
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
