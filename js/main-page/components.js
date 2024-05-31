/**
 * @attribute img-src - 이미지 경로
 * @attribute name - 해당 도구 이름
 * @attribute hover-bgcolor - 마우스 호버 시 적용할 배경색 (선택)
 * @example <tool-thumbnail img-src='images/myimage.jpg' name='todo' hover-bgcolor='red'></tool-thumbnail>
 */
export class ToolThumbnail extends HTMLElement {
    connectedCallback() {
        let computedStyle = window.getComputedStyle(document.documentElement);
        let toolName = this.getAttribute('name');
        let hoverBgColor = this.getAttribute('hover-bgcolor');
        if (hoverBgColor == 'null') {
            hoverBgColor = computedStyle.getPropertyValue('--tool-thumbnail-default-bgcolor');
        }
        this.innerHTML = `<style>
            tool-thumbnail[name="${toolName}"] > section:hover > .for-bg {
                background-color: ${hoverBgColor};
                transform: scaleY(1);
                transition: transform 0.3s;
            }
        </style>`;
        this.innerHTML += `<section>
            <a href="html/table.html${this.getAttribute('id')}">
                <img src="${this.getAttribute('img-src')}" alt="${toolName}">
                <p>${toolName}</p>
            </a>
            <div class="for-bg"></div>
        </section>`;
    }
}
