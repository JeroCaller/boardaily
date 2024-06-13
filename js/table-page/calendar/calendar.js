import * as helper from '../../helper.js';

class CalendarTitle extends HTMLElement {
    async connectedCallback() {
        this._initAttr();
        this.innerHTML = await this.combineStyleAndHTML();
        this.setTitle();
    }

    _initAttr() {
        this.calendarTitle = this.getAttribute('title');
        if (!this.calendarTitle) {
            this.calendarTitle = '캘린더';
        }
    }

    async _setStyle() {
        return `<style>${await fetch('/js/table-page/calendar/calendar-title.css').then(res => res.text())}</style>`;
    }

    async _setInnerHTML() {
        return await fetch('/js/table-page/calendar/calendar-title.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return await this._setStyle() + await this._setInnerHTML();
    }

    setTitle() {
        this.querySelector('#cld-title > h3').innerHTML = this.calendarTitle;
    }
}

class Calendar extends HTMLElement {
    async connectedCallback() {
        this.todayDate = new Date();
        this.currentDate = new Date(); // 현재 달력 화면에 보여지고 있는 연-월. 오늘 날짜란 보장이 없다. 
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        /*
        let mutationObserver = new MutationObserver((mutationRecord, observer) => {
            this._initElementVars();
            this.setGrid();
            this.showCalendar(this.currentDate);
            this.setEventHandler();
            observer.disconnect();
        });
        mutationObserver.observe(this.shadowRoot.querySelector('calendar-title'), {childList: true});
        */
        helper.waitForRenderingAndExecuteFunctions(
            this.shadowRoot.querySelector('calendar-title'),
            [
                [this._initElementVars.bind(this)],
                [this.setGrid.bind(this)],
                [this.showCalendar.bind(this, this.currentDate)],
                [this.setEventHandler.bind(this)],
            ]
        );
    }

    async _setStyle() {
        return `<style>${await fetch('/js/table-page/calendar/calendar.css').then(res => res.text())}</style>`;
    }

    async _setInnerHTML() {
        return await fetch('/js/table-page/calendar/calendar.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return await this._setStyle() + await this._setInnerHTML();
    }

    _initElementVars() {
        this.calendarGrid = this.shadowRoot.querySelector('#calendar-grid');
        this.calendarTitle = this.shadowRoot.querySelector('#cld-title > h3');
        this.btnLeft = this.shadowRoot.querySelector('#buttons > input[value="chevron_left"]');
        this.btnRight = this.shadowRoot.querySelector('#buttons > input[value="chevron_right"]');
        this.btnToday = this.shadowRoot.querySelector('#buttons > input[value="오늘"]');
    }

    setGrid() {
        const weekday = ["일", "월", "화", "수", "목", "금", "토"];
        let oneCellElement;
        for (let day of weekday) {
            this.calendarGrid.insertAdjacentHTML("beforeend", 
                `<div class="cell weekday">${day}</div>`
            );
            oneCellElement = this.calendarGrid.lastChild;
            switch (day) {
                case "토":
                    oneCellElement.classList.add('saturday');
                    break;
                case "일":
                    oneCellElement.classList.add('sunday');
            }
        }
        for (let i = 0; i < 42; i++) {
            this.calendarGrid.insertAdjacentHTML("beforeend", 
                `<div class="cell" id="pos-${i}">
                    <ul>
                        <li class="for-number"></li>
                    </ul>
                </div>`);
            oneCellElement = this.calendarGrid.lastChild;
            switch (i % 7) {
                case 0:
                    oneCellElement.classList.add('sunday');
                    break;
                case 6:
                    oneCellElement.classList.add('saturday');
                    break;
            }
        }
    }

    /**
     * 
     * @param {Date} targetDate - 달력에 보여주고자 하는 날짜가 담긴 Date 객체
     */
    showCalendar(targetDate) {
        let startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        let endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        let numberLi;
        let countCurrentDate;

        for (let i = 0; i < 42; i++) {
            numberLi = this.calendarGrid.querySelector(`#pos-${i} > ul > .for-number`);
            countCurrentDate = i - startDate.getDay() + 1;
            if (i < startDate.getDay() || countCurrentDate > endDate.getDate()) {
                numberLi.innerText = '';
            } else {
                numberLi.innerText = countCurrentDate;
            }
        }
        this.calendarTitle.innerText = `${targetDate.getFullYear()}. ${targetDate.getMonth() + 1}`;
        this.markToday(targetDate);
    }

    setEventHandler() {
        this.btnToday.addEventListener('click', () => {
            this.currentDate = new Date();
            this.showCalendar(this.currentDate);
        });
        this.btnLeft.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.showCalendar(this.currentDate);
        });
        this.btnRight.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.showCalendar(this.currentDate);
        })
    }

    getTodayDate() {
        this.todayDate = new Date();  // 오늘 날짜로 업데이트.
        return this.todayDate;
    }

    /**
     * 
     * @param {Date} targetDate 
     */
    markToday(targetDate) {
        this.getTodayDate();
        let todayStartDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        let targetCellElement = this.calendarGrid
            .querySelector(`#pos-${todayStartDate.getDay() + this.todayDate.getDate() - 1}`);
        if (targetDate.getFullYear() == this.todayDate.getFullYear() && 
        targetDate.getMonth() == this.todayDate.getMonth()) {
            targetCellElement.style.backgroundColor = 'var(--today-bgcolor)';
            targetCellElement.querySelector('ul > .for-number').innerText += ' 오늘';
        } else {
            targetCellElement.style.backgroundColor = 'var(--default-bgcolor)';
        }
    }
}

export function createCalendarElement() {
    try {
        customElements.define('calendar-title', CalendarTitle);
        customElements.define('custom-calendar', Calendar);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('custom-calendar');
}
