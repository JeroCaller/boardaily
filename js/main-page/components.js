/**
 * @attribute img-src - 이미지 경로
 * @attribute name - 해당 도구 이름
 * @attribute dest-link - 이동할 페이지 url
 * @example <tool-thumbnail img-src='images/myimage.jpg' name='todo' dest-link='todo.html'></tool-thumbnail>
 */
export class ToolThumbnail extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).innerHTML = `<style>
            section {
                border: 3px solid blue;
                width: 20em;
            }
            section > a {
                text-decoration: none;
            }
            section > a > img {
                width: 100%;
            }
            section > a > p {
                text-align: center;
                width: 100%;
                margin: 0px;
                padding: 1em;
                box-sizing: border-box;
                font-size: larger;
            }
            section:hover {
                background-color: blue;
            }
        </style>
        <section>
            <a href="${this.getAttribute('dest-link')}">
                <img src="${this.getAttribute('img-src')}" alt="${this.getAttribute('name')}">
                <p>${this.getAttribute('name')}</p>
            </a>
        </section>`;
    }
}