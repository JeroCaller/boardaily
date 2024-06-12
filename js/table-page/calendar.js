class CalendarTitle extends HTMLElement {
    connectedCallback() {
        this._initAttr();
        this.innerHTML = this.combineStyleAndHTML();
    }

    _initAttr() {
        this.calendarTitle = this.getAttribute('title');
        if (!this.calendarTitle) {
            this.calendarTitle = '캘린더';
        }
    }

    _setStyle() {
        return `<style>
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
            #calendar-title-container {
                --default-bgcolor: #83B4FF;
                --active-bgcolor: #3572EF;

                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 100%;
                height: 4em;
                background-color: var(--default-bgcolor);
            }
            input[class="material-symbols-outlined"] {
                border-width: 0;
                width: 2em;
                height: 100%;
                background-color: #1A2130;
                color: white;
            }
            input[class="material-symbols-outlined"]:hover {
                cursor: pointer;
            }
            input[class="material-symbols-outlined"]:active {
                background-color: var(--active-bgcolor);
            }
            #cld-title {
                margin: 0 5em;
            }
            #buttons {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 15em;
            }
            #buttons > input[value="오늘"] {
                background-color: #83B4FF;
                border: 1px solid white;
                border-radius: 0.5em;
                font-size: 0.9em;
                padding: 1em;
            }
            #buttons > input[value="오늘"]:hover {
                cursor: pointer;
            }
            #buttons > input[value="오늘"]:active {
                background-color: var(--active-bgcolor);
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<div id="calendar-title-container">
            <div id="cld-title">
                <h3>${this.calendarTitle}</h3>
            </div>
            <div id="buttons">
                <input type="button" value="chevron_left" class="material-symbols-outlined">
                <input type="button" value="오늘">
                <input type="button" value="chevron_right" class="material-symbols-outlined">
            </div>
        </div>`;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
    }
}

class Calendar extends HTMLElement {
    connectedCallback() {
        this.todayDate = new Date();
        this.currentDate = new Date(); // 현재 달력 화면에 보여지고 있는 연-월. 오늘 날짜란 보장이 없다. 
        this.attachShadow({mode: 'open'}).innerHTML = this.combineStyleAndHTML();
        this._initElementVars();
        this.setGrid();
        this.showCalendar(this.currentDate);
        this.setEventHandler();
    }

    _setStyle() {
        return `<style>
            :host {
                --default-bgcolor: #A7E6FF;
                --today-bgcolor: #3572EF;

                width: 100%;
                background-color: var(--default-bgcolor);
            }
            #calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                grid-template-columns: repeat(7, 1fr);
                gap: 0.3em 0.3em;
                margin-top: 0.5em;
            }
            .cell {
                border: 1px groove grey;
                border-radius: 0.4em;
                height: 5em;
                padding: 0.5em;
                overflow: hidden;
            }
            .cell > ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .weekday {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2em;
            }
            .saturday {
                color: blue;
            }
            .sunday {
                color: red;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<calendar-title></calendar-title>
        <div id="calendar-grid"></div>`;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
    }

    _initElementVars() {
        this.calendarGrid = this.shadowRoot.querySelector('#calendar-grid');
        this.calendarTitle = this.shadowRoot.querySelector('#cld-title > h3');
        this.btnLeft = this.shadowRoot.querySelector('#buttons > input[value="chevron_left"]');
        this.btnRight = this.shadowRoot.querySelector('#buttons > input[value="chevron_right"]');
        this.btnToday = this.shadowRoot.querySelector('#buttons > input[value="오늘"]')
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
