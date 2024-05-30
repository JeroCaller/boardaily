import {ToolThumbnail} from './main-page/components.js';

async function main() {
    const pageMain = document.querySelector('main');

    customElements.define('tool-thumbnail', ToolThumbnail);
    let toolJson = await fetch('tools-info.json').then(res => res.json());
    for (let i = 0; i < toolJson.length; i++) {
        let iHTML = `<tool-thumbnail 
        id="#${toolJson[i]["img-src"].split('.')[0].split('/')[1]}"
        name="${toolJson[i].name}" 
        img-src="${toolJson[i]["img-src"]}" 
        hover-bgcolor="${toolJson[i]["hover-bgcolor"]}"
        ></tool-thumbnail>`;
        pageMain.insertAdjacentHTML("beforeend", iHTML);
    }

    //pageMain.innerHTML = '<tool-thumbnail name="계산기" img-src="images/calculator.png" id="#calculator" hover-bgcolor="pink"></tool-thumbnail>';
}

main();