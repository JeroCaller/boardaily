import {createSideMenu} from './table-page/side-menu.js';
import {createCalcElement} from './table-page/calculator.js';
import { createAgeCalcElement } from './table-page/age-calculator.js';
import { createCalendarElement } from './table-page/calendar.js';
import * as helper from './helper.js';

async function constructMenu() {
    const navTag = document.querySelector('#side-left > nav');

    let sideMenuElement = await createSideMenu();
    navTag.append(sideMenuElement);
    return sideMenuElement;
}

/**
 * 주어진 부모 요소에 현재 페이지 이름에 따른 툴 요소를 부착한다. 부모 요소에 이미 
 * 자식 요소가 있는 경우, 해당 자식 요소를 먼저 삭제하고 작업한다. 
 * @param {string} currentPageName - 현재 페이지 이름. url의 맨 끝에 # 이후의 단어.
 * @param {HTMLElement} parentElement - 툴 요소를 추가할 부모 요소. 툴 요소 하나만 
 * 자식 요소로 삼아야 하며, 그 외에 다른 자식 요소들을 포함해선 안된다. 
 * @returns parentElement - 툴 자식 요소가 부착된 부모 요소.
 */
function attachToolElement(currentPageName, parentElement) {
    if (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }

    let toolElement;
    switch (currentPageName) {
        case "calculator":
            toolElement = createCalcElement();
            break;
        case "age":
            toolElement = createAgeCalcElement();
            break;
        case "calendar":
            toolElement = createCalendarElement();
            break;
    }
    if (toolElement) {
        parentElement.append(toolElement);
    }
    return parentElement;
}

async function main() {
    const contentMain = document.getElementById('content-main');

    let sideMenuElement = await constructMenu();
    sideMenuElement.addEventListener('click', event => {
        if (event.target.tagName != 'MENU-ITEM') {
            return;
        }
        let toolName = helper.extractFileName(event.target.getAttribute('img-src'));
        attachToolElement(toolName, contentMain);
    });

    // 메인 페이지에서 특정 툴 페이지로 넘어갈 때.
    const currentPageName = location.href.split('#')[1];
    attachToolElement(currentPageName, contentMain);
}

main();