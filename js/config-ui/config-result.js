import { createConfigModalElement } from "./config-modal/config-modal.js";
import { createTabElement } from "./config-tab/tab.js";
import { createImageContainerElement } from "./image-container/image-container.js";
import { customEventsInfo } from "../custom-events.js";
import { loadBgImage } from "../functions.js";

let currentTabStorageEventInfo = customEventsInfo["current-tab-storage"];
currentTabStorageEventInfo.eventOption = {bubbles: true};

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
            margin: 2em auto;
            text-align: center;
        }
        #icon-container > div > span {
            font-size: 2em;
            cursor: pointer;
        }
    </style>
    <div id='icon-container'>
        <div>
            <span id="light-dark-mode" class="material-symbols-outlined">light_mode</span>
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
        <label>제공: <span> 추후 해당 기능 추가 예정 </span></label>
    </div>
    `);
    imgSearch.append(createImageContainerElement());

    configModal.append(
        createTabElement(defaultImg, lightDarkMode, imgSearch)
    )

    return configModal;
}

/**
 * @param {HTMLElement} configModal 
 */
function setEventHandlersOnConfigModal(configModal) {
    document.addEventListener('image-container-click', event => {
        localStorage.setItem('bg-image', event.detail["img-src"]);
        currentTabStorageEventInfo.eventDetail = {name: 'bg-image'};
        document.dispatchEvent(currentTabStorageEventInfo.getEventObj());
    });
    document.addEventListener('current-tab-storage', event => {
        if (event.detail.name != 'bg-image') return;
        loadBgImage();
    });
    configModal.addEventListener('click', event => {
        if (event.target.id != "light-dark-mode") return;
        if (!event.target.textContent in ['light_mode', 'dark_mode']) return;

        switch (event.target.textContent) {
            case 'light_mode':
                event.target.textContent = 'dark_mode';
                event.target.parentNode.querySelector('p').textContent = '어둡게';
                localStorage.setItem('bg-image', '--dark-mode');
                break;
            case 'dark_mode':
                event.target.textContent = 'light_mode';
                event.target.parentNode.querySelector('p').textContent = '밝게';
                localStorage.setItem('bg-image', '--light-mode');
        }

        currentTabStorageEventInfo.eventDetail = {name: 'bg-image'};
        document.dispatchEvent(currentTabStorageEventInfo.getEventObj());
    });
}

export function createConfigIcon() {
    const configModal = getConstructedConfigModal();
    setEventHandlersOnConfigModal(configModal);

    const configIcon = document.createElement('span');
    configIcon.setAttribute('id', 'config-icon');
    configIcon.setAttribute('class', 'material-symbols-outlined');
    configIcon.textContent = 'settings';
    configIcon.addEventListener('click', () => {
        if (!document.querySelector('config-modal')) {
            document.querySelector('body').append(configModal);
        } else {
            document.querySelector('config-modal').style.display = 'flex';
        }
    });
    
    return configIcon;
}