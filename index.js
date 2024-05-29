import {ToolThumbnail} from './js/main-page/components.js';

function main() {
    const pageMain = document.querySelector('main');

    customElements.define('tool-thumbnail', ToolThumbnail);

    pageMain.innerHTML = '<tool-thumbnail name="계산기" img-src="images/calculator.png" dest-link="test.html"></tool-thumbnail>';
}

main();