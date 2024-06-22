import { createImageContainerElement } from "../../js/config-ui/image-container/image-container.js";

function main() {
    const container = document.querySelector('#container');
    const imageContainer = createImageContainerElement();
    imageContainer.insertAdjacentHTML('beforeend', 
    `<img src="/images/background/board1.png">
    <img src="/images/background/board2.png">
    <img src="/images/background/board3.png">
    <img src="/images/background/board4.png">
    <img src="/images/background/board5.png">
    `);
    container.append(imageContainer);

    const resultDiv = document.querySelector('#result');
    document.addEventListener('image-container-click', event => {
        resultDiv.replaceChildren();
        resultDiv.insertAdjacentHTML('beforeend', `<img src="${event.detail['img-src']}">`);
    });
}

main();
