import { createModalWindowElement } from "../../js/modal/modal.js";

function main() {
    const ModalElement = createModalWindowElement(['z-index', 10], ['mode', 'config']);
    const bodyElement = document.querySelector('body');

    bodyElement.append(ModalElement);

    document.querySelector('#config-icon').addEventListener('click', () => {
        ModalElement.style.display = 'flex';
    });
}

main();
