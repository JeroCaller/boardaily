import { createConfigModalElement } from "/js/config-ui/config-modal/config-modal.js";

function main() {
    const configModalElement = createConfigModalElement(['z-index', 10]);
    const bodyElement = document.querySelector('body');

    bodyElement.append(configModalElement);

    document.querySelector('#config-icon').addEventListener('click', () => {
        configModalElement.style.display = 'flex';
    });
}

main();
