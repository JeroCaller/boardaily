import {createSideMenu} from './table-page/side-menu.js';
import {createCalcElement} from './table-page/calculator.js';

async function constructMenu() {
    const navTag = document.querySelector('#side-left > nav');

    let sideMenuElement = await createSideMenu();
    navTag.append(sideMenuElement);
}

async function main() {
    const contentMain = document.getElementById('content-main');

    await constructMenu();
    contentMain.append(createCalcElement());
}

main();