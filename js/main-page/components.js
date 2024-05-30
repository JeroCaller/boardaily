/**
 * @attribute img-src - 이미지 경로
 * @attribute name - 해당 도구 이름
 * @attribute hover-bgcolor - 마우스 호버 시 적용할 배경색 (선택)
 * @example <tool-thumbnail img-src='images/myimage.jpg' name='todo' hover-bgcolor='red'></tool-thumbnail>
 */
export class ToolThumbnail extends HTMLElement {
    connectedCallback() {
        let computedStyle = window.getComputedStyle(document.documentElement);
        let defaultWidth = computedStyle.getPropertyValue('--tool-thumbnail-default-width');
        let defaultHeight = computedStyle.getPropertyValue('--tool-thumbnail-default-height');
        let toolName = this.getAttribute('name');
        let hoverBgColor = this.getAttribute('hover-bgcolor');
        if (hoverBgColor == 'null') {
            hoverBgColor = computedStyle.getPropertyValue('--tool-thumbnail-default-bgcolor');
        }
        this.innerHTML = `<style>
            tool-thumbnail[name="${toolName}"] > section > a {
                position: absolute;
                z-index: 2;
            }
            tool-thumbnail[name="${toolName}"] > section > div {
                width: ${defaultWidth};
                height: 0;
                position: absolute;
                z-index: 1;
            }
            tool-thumbnail[name="${toolName}"] > section:hover > div {
                background-color: ${hoverBgColor};
                height: ${defaultHeight};
                transition: height 0.5s;   
            }
        </style>`;
        this.innerHTML += `<section>
            <a href="${this.getAttribute('id')}">
                <img src="${this.getAttribute('img-src')}" alt="${toolName}">
                <p>${toolName}</p>
            </a>
            <div class="for-bg"></div>
        </section>`;
    }
}