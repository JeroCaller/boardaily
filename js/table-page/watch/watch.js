import * as wLogic from './watch-logic.js';

class DigitalWatch extends HTMLElement {
    constructor() {
        super();
        this.watchId;
    }

    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this.initElement();
        this.init();
        this.setEventHandlers();
    }

    disconnectedCallback() {
        clearTimeout(this.watchId);
    }

    _setStyle() {
        return `<link rel="stylesheet" href="js/table-page/watch/watch.css">`;
    }

    async _setInnerHTML() {
        return await fetch('js/table-page/watch/watch.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    initElement() {
        this.watchConfig = this.shadowRoot.querySelector('#watch-config');
        this.dateElement = this.shadowRoot.querySelector('#date');
        this.timeElement = this.shadowRoot.querySelector('#time');

        this.hour1224 = this.watchConfig.querySelector('#hours');
    }

    init() {
        if ('hour-system' in localStorage) {
            this.hour1224.textContent = localStorage.getItem('hour-system');
            switch (this.hour1224.textContent) {
                case '24':
                    this.tick({hour12: true});
                    break;
                case 'AM/PM':
                    this.tick({hour12: false});
                    break;
            }
        } else {
            this.tick();
        }
    }

    tick(datetimeOption) {
        let thisTime = new Date();
        this.dateElement.textContent = `${thisTime.toLocaleDateString()} ${wLogic.getWeekName(thisTime.getDay())}`;
        this.timeElement.textContent = thisTime.toLocaleTimeString('ko-KR', datetimeOption? datetimeOption : undefined);
        this.watchId = setTimeout(this.tick.bind(this, datetimeOption), 1000);
    }

    changeHourSystem(textData) {
        switch (textData) {
            case '24':
                this.hour1224.textContent = 'AM/PM';
                this.tick({hour12: false});
                break;
            case 'AM/PM':
                this.hour1224.textContent = '24';
                this.tick({hour12: true});
                break;
        }
    }

    setEventHandlers() {
        this.hour1224.addEventListener('click', () => {
            clearTimeout(this.watchId);
            this.changeHourSystem(this.hour1224.textContent);
            localStorage.setItem('hour-system', this.hour1224.textContent);
        });
    }
}

export function createWatchElement() {
    try {
        customElements.define('digital-watch', DigitalWatch);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('digital-watch');
}
