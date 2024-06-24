import { createConfigModalElement } from "./config-modal/config-modal.js";
import { createTabElement } from "./config-tab/tab.js";
import { createImageContainerElement } from "./image-container/image-container.js";

function getConstructedConfigModal() {
    const configModal = createConfigModalElement(['z-index', 10]);

    const defaultImg = createImageContainerElement();
    defaultImg.setAttribute('tabname', 'photo_library');
    defaultImg.setAttribute('on-icon', '');
    defaultImg.insertAdjacentHTML('beforeend', 
    `<img src="/images/background/board1.png">
    <img src="/images/background/board2.png">
    <img src="/images/background/board3.png">
    <img src="/images/background/board4.png">
    <img src="/images/background/board5.png">
    `);
    
    const lightDarkMode = document.createElement('div');
    lightDarkMode.setAttribute('tabname', 'light_mode');
    lightDarkMode.setAttribute('on-icon', '');
    lightDarkMode.setAttribute('style', 
    `width: 100%`);
    lightDarkMode.insertAdjacentHTML('beforeend', 
    `<style>
        #icon-container {
            width: 100%;
            box-sizing: border-box;

            display: flex;
            justify-content: center;
            align-items: center;
        }
        #icon-container > div {
            margin-top: 2em;
            text-align: center;
        }
        #icon-container > div > span {
            font-size: 2em;
            cursor: pointer;
        }
    </style>
    <div id='icon-container'>
        <div>
            <span class="material-symbols-outlined">light_mode</span>
            <p>밝게</p>
        </div>
    </div>
    `);

    const imgSearch = document.createElement('div');
    imgSearch.setAttribute('tabname', 'image_search');
    imgSearch.setAttribute('on-icon', '');
    imgSearch.insertAdjacentHTML('beforeend', 
    `<style>
        #content-container {
            display: flex;
            align-items: center;
            margin-bottom: 1em;
        }
        input[type="search"] {
            height: 2em;
            margin-right: 1em;
        }
    </style>
    <div id="content-container">
        <input type="search" placeholder="이미지 검색">
        <label>제공: <span>hi</span></label>
    </div>
    `);
    imgSearch.append(createImageContainerElement());

    configModal.append(
        createTabElement(defaultImg, lightDarkMode, imgSearch)
    )

    return configModal;
}

export function createConfigIcon() {
    let configIcon = document.createElement('span');
    configIcon.setAttribute('id', 'config-icon');
    configIcon.setAttribute('class', 'material-symbols-outlined');
    configIcon.textContent = 'settings';
    configIcon.addEventListener('click', () => {
        if (!document.querySelector('config-modal')) {
            document.querySelector('body').append(getConstructedConfigModal());
        } else {
            document.querySelector('config-modal').style.display = 'flex';
        }
    });
    
    return configIcon;
}
