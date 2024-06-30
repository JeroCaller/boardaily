import * as dcLogic from './date-calculator-logic.js';
import { InvalidDateFormatError } from '../../custom-error.js';

class DateCalculator extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.initElement();
        this.setEventHandlers();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="js/table-page/date-calculator/date-calculator.css">`;
    }

    async _setInnerHTML() {
        return await fetch('js/table-page/date-calculator/date-calculator.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initElement() {
        this.startDate = this.shadowRoot.querySelector('#start-date');
        this.endDate = this.shadowRoot.querySelector('#end-date');
        this.calcBtn = this.shadowRoot.querySelector('#calculate');
        this.resultDisp = this.shadowRoot.querySelector('#result-displayer');
    }

    setEventHandlers() {
        this.calcBtn.addEventListener('click', () => {
            let calcResult;
            try {
                calcResult = new dcLogic.CalcDateDiff(
                    this.startDate.value, this.endDate.value
                ).getResult();
            } catch (err) {
                if (err instanceof InvalidDateFormatError) {
                    alert('시작일과 마지막일 모두 입력해주세요.');
                    return;
                } else {
                    throw err;
                }
            }

            this.resultDisp.querySelector('#days').querySelector('p').textContent = calcResult.days;
            this.resultDisp.querySelector('#weeks').querySelector('p').textContent = calcResult.weeks;
            this.resultDisp.querySelector('#months').querySelector('p').textContent = calcResult.months;
            this.resultDisp.querySelector('#years').querySelector('p').textContent = calcResult.years;
            this.resultDisp.querySelector('#diff-date').querySelector('p')
                .textContent = `${calcResult.date.year}년 ${calcResult.date.month}개월 ${calcResult.date.day}일`;
        });
    }
}

export function createDateCalculatorElement() {
    try {
        customElements.define('date-calculator', DateCalculator);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('date-calculator');
}
