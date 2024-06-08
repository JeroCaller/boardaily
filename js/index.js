import {ToolThumbnail} from './main-page/components.js';
import * as helper from './helper.js';

async function main() {
    const pageMain = document.querySelector('main');

    customElements.define('tool-thumbnail', ToolThumbnail);

    const tools = await helper.toolsInfo;
    for (let prop in tools) {
        let iHTML = `<tool-thumbnail
        id="#${prop}"
        name="${tools[prop].name}"
        img-src="${tools[prop]["img-src"]}"
        hover-bgcolor="${tools[prop]["hover-bgcolor"]}"
        ></tool-thumbnail>`;
        pageMain.insertAdjacentHTML("beforeend", iHTML);
    }
}

main();