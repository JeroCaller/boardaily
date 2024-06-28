import { createConfigModalElement } from "./config-modal/config-modal.js";
import { createTabElement } from "./config-tab/tab.js";
import { createImageContainerElement } from "./image-container/image-container.js";
import { customEventsInfo } from "../custom-events.js";
import { loadBgImage } from "../functions.js";
import * as helper from '../helper.js';

let currentTabStorageEventInfo = customEventsInfo["current-tab-storage"];
currentTabStorageEventInfo.eventOption = {bubbles: true};

async function getConstructedConfigModal() {
    const configModal = createConfigModalElement(['z-index', 10]);

    const defaultImg = createImageContainerElement();
    defaultImg.setAttribute('tabname', 'photo_library');
    defaultImg.setAttribute('on-icon', '');
    defaultImg.setAttribute('caption', 'Boardaily 제공 배경 이미지로 변경');

    const bgImagesPath = await helper.getBgImagesPath();
    for (let i = 0; i < bgImagesPath.length; i++) {
        let imgElement = document.createElement('img');
        imgElement.setAttribute('src', bgImagesPath[i].path);
        if (!bgImagesPath[i].category) {
            imgElement.setAttribute('title', bgImagesPath[i].detail);
        } else {
            imgElement.setAttribute('title', 
            `${bgImagesPath[i].detail} (${bgImagesPath[i].category})`);
        }
        defaultImg.append(imgElement);
    }
    
    const lightDarkMode = document.createElement('div');
    lightDarkMode.setAttribute('tabname', 'light_mode');
    lightDarkMode.setAttribute('on-icon', '');
    lightDarkMode.setAttribute('style', `width: 100%`);
    lightDarkMode.setAttribute('caption', 'light/dark mode');
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
    imgSearch.setAttribute('caption', '온라인서 배경 이미지 검색');
    imgSearch.insertAdjacentHTML('beforeend', 
    `<style>
        #content-container {
            display: flex;
            align-items: center;
            margin-bottom: 1em;
        }
        input[type="search"] {
            height: 2em;
        }
        input[type="button"] {
            font-size: 1.1em;
        }
        #image-search {
            display: flex;
            align-items: center;
            margin-right: 0.5em;
        }
    </style>
    <div id="content-container">
        <div id="image-search">
            <input type="search" placeholder="이미지 검색">
            <input type="button" class="material-symbols-outlined" value="search">
        </div>
        <label>제공: <span> 추후 추가 예정 </span></label>
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
        if (!event.detail) return;
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

export async function createConfigIcon() {
    const configModal = await getConstructedConfigModal();
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
