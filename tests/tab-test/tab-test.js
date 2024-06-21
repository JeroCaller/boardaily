import { createTabElement } from "../../js/tab/tab.js";

function main() {
    const content1 = document.createElement('div');
    content1.setAttribute('tabname', '인사 메시지');
    content1.insertAdjacentHTML('beforeend', `<div>
        <p>안녕하세요.</p>
    </div>`);

    const content2 = document.createElement('div');
    content2.setAttribute('tabname', '현재 시각');
    content2.textContent = new Date().toLocaleString();

    const content3 = document.createElement('div');
    content3.setAttribute('tabname', '일기');
    content3.insertAdjacentHTML('beforeend', `
    <p>역시 코딩은 어렵다.</p>
    <p>하지만 한 번 어려움을 극복하면 뿌듯하고, 내 자신이 능력자가 된 것만 같다.</p>
    `);

    document.querySelector('#container').append(createTabElement(
        content1, content2, content3
    ));
}

main();
