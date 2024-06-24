export function loadBgImage() {
    let imgSrc = localStorage.getItem('bg-image');
    if (!imgSrc) return imgSrc;

    const bodyElement = document.querySelector('body');
    const container = document.querySelector('#container');
    const smallTitle = document.querySelector('#small-title > a');

    switch (imgSrc) {
        case '--dark-mode':
            bodyElement.style.backgroundImage = 'none';
            bodyElement.style.backgroundColor = '#222831';
            smallTitle.style.color = "rgb(220, 220, 220)";
            container.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            break;
        case '--light-mode':
            bodyElement.style.backgroundImage = 'none';
            bodyElement.style.backgroundColor = 'white';
            smallTitle.style.color = 'black';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            break;
        case null:
            break;
        default:
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            smallTitle.style.color = 'black';
            bodyElement.style.backgroundImage = `url('${imgSrc}')`;
            bodyElement.style.backgroundSize = 'cover';
    }

    return imgSrc;
}
