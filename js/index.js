import {ToolThumbnail} from './main-page/components.js';
import * as helper from './helper.js';

async function main() {
    const pageMain = document.querySelector('main');

    customElements.define('tool-thumbnail', ToolThumbnail);
    let toolJson = await helper.getToolInfoInJson();
    for (let i = 0; i < toolJson.length; i++) {
        let iHTML = `<tool-thumbnail 
        id="#${helper.extractFileName(toolJson[i]["img-src"])}"
        name="${toolJson[i].name}" 
        img-src="${toolJson[i]["img-src"]}" 
        hover-bgcolor="${toolJson[i]["hover-bgcolor"]}"
        ></tool-thumbnail>`;
        pageMain.insertAdjacentHTML("beforeend", iHTML);
    }

    //pageMain.innerHTML = '<tool-thumbnail name="계산기" img-src="images/calculator.png" id="#calculator" hover-bgcolor="pink"></tool-thumbnail>';
}

main();