import {createSideMenu} from './table-page/side-menu.js';

async function main() {
    const navTag = document.querySelector('#side-left > nav');

    let sideMenuElement = await createSideMenu();
    navTag.append(sideMenuElement);
}

main();