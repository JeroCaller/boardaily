export function getRandomImgElement() {
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', 'images/background/question-mark.png');
    imgElement.setAttribute('alt', '오늘의 랜덤 이미지');
    imgElement.setAttribute('title', '오늘의 랜덤 이미지');
    imgElement.setAttribute('class', 'just-icon');
    showImgAttributions(imgElement, {name: 'wow'}, {name: 'good'});

    return imgElement;
}

/**
 * 
 * @param {HTMLElement} imgElement 
 * @param {object} author - ex) {name: "name", url: "url"}
 * @param {object} imgHostName - ex) {name: "name", url: "url"}
 */
function showImgAttributions(imgElement, author, imgHostName) {
    const main = document.querySelector('main');

    imgElement.addEventListener('click', () => {
        if (main.querySelector('#img-attributions')) {
            return;
        }

        main.insertAdjacentHTML('beforeend', 
        `<span id="img-attributions">
            Photo by 
            <a href="${author.url? author.url : '#img-author'}">${author.name}</a> 
            on 
            <a href="${imgHostName.url ? imgHostName.url : '#img-host'}">${imgHostName.name}</a>
        </span>
        `);
    });
}
