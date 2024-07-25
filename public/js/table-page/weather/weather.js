import { records } from '../../weather-api/read-data.js';
import { RegionTree } from "../../weather-api/region-tree.js";
import { BinaryTreeForWeather} from '../../weather-api/binary-tree.js';

class Weather extends HTMLElement {
    async connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = await this.combineStyleAndHTML();
        this._initElements();
    }

    _setStyle() {
        return `<link rel="stylesheet" href="js/table-page/weather/weather.css">`;
    }

    async _setInnerHTML() {
        return await fetch('js/table-page/weather/weather.html').then(res => res.text());
    }

    async combineStyleAndHTML() {
        return this._setStyle() + await this._setInnerHTML();
    }

    _initElements() {
        this.dropDowns = this.shadowRoot.querySelectorAll('#drop-downs > select');
    }
}

export function createWeatherElement() {
    try {
        customElements.define('weather-info', Weather);
    } catch (errorObj) {
        if (!errorObj instanceof DOMException) {
            throw errorObj;
        }
    }

    return document.createElement('weather-info');
}
