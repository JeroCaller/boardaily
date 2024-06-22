import { createConfigModalElement } from "./config-modal/config-modal.js";
import { createTabElement } from "./config-tab/tab.js";
import { createImageContainerElement } from "./image-container/image-container.js";

export function getConstructedConfigModal() {
    const configModal = createConfigModalElement(['z-index', 10]);

    const defaultImg = createImageContainerElement();
    defaultImg.setAttribute('tabname', 'photo_library');
    defaultImg.setAttribute('on-icon', '');
    //defaultImg.setAttribute('slot', 'elements');
    defaultImg.insertAdjacentHTML('beforeend', 
    `<img src="/images/background/board1.png">
    <img src="/images/background/board2.png">
    <img src="/images/background/board3.png">
    <img src="/images/background/board4.png">
    <img src="/images/background/board5.png">`
    );
    
    const lightDarkMode = document.createElement('div');
    lightDarkMode.setAttribute('tabname', 'light_mode');
    lightDarkMode.setAttribute('on-icon', '');
    //lightDarkMode.setAttribute('slot', 'elements');
    lightDarkMode.insertAdjacentHTML('beforeend', 
    `<span class="material-symbols-outlined">light_mode</span>`);

    const imgSearch = createImageContainerElement();
    imgSearch.setAttribute('tabname', 'image_search');
    imgSearch.setAttribute('on-icon', '');
    //imgSearch.setAttribute('slot', 'elements');
    imgSearch.insertAdjacentHTML('beforeend', `<input type="search">`);

    configModal.append(
        createTabElement(defaultImg, lightDarkMode, imgSearch)
    )

    return configModal;
}
