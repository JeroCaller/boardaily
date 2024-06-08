/**
 * @attribute img-src - 이미지 경로
 * @attribute name - 해당 도구 이름
 * @attribute hover-bgcolor - 마우스 호버 시 적용할 배경색 (선택)
 * @example <tool-thumbnail img-src='images/myimage.jpg' name='todo' hover-bgcolor='red'></tool-thumbnail>
 */
export class ToolThumbnail extends HTMLElement {
    connectedCallback() {
        this._initAttributes();
        this.innerHTML = this.combineStyleAndHTML();
    }

    _initAttributes() {
        this.toolName = this.getAttribute('name');
        this.hoverBgColor = this.getAttribute('hover-bgcolor');
        let computedStyle = window.getComputedStyle(document.documentElement);
        if (this.hoverBgColor == 'null') {
            this.hoverBgColor = computedStyle.getPropertyValue('--tool-thumbnail-default-bgcolor');
        }
    }

    _setStyle() {
        return `<style>
            tool-thumbnail[name="${this.toolName}"] > section:hover > .for-bg {
                background-color: ${this.hoverBgColor};
                transform: scaleY(1);
                transition: transform 0.3s;
            }
        </style>`;
    }

    _setInnerHTML() {
        return `<section>
            <a href="html/table.html${this.getAttribute('id')}">
                <img src="${this.getAttribute('img-src')}" alt="${this.toolName}">
                <p>${this.toolName}</p>
            </a>
            <div class="for-bg"></div>
        </section>`;
    }

    combineStyleAndHTML() {
        return this._setStyle() + this._setInnerHTML();
    }
}
