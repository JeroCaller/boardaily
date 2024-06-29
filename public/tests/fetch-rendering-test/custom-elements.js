import * as helper from './helper.js';

class SubElement extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = await this.setInnerHTML();
    }

    async setInnerHTML() {
        return await fetch('./sub-element.html').then(res => res.text());
    }
}

class SupElement extends HTMLElement {
    async connectedCallback() {
        this.mutationOb;
        this.attachShadow({mode: 'open'}).innerHTML = await this.setInnerHTML();
        helper.waitForRenderingAndExecuteFunc(
            this.controlDOM.bind(this),
            this.shadowRoot.querySelector('sub-element')
        );
        //this.controlDOM();
    }

    async setInnerHTML() {
        return await fetch('./sup-element.html').then(res => res.text());
    }

    controlDOM() {
        this.shadowRoot.querySelector('#sub-container > p').innerText = "controlled by super element";
        this.shadowRoot.querySelector('#sup-element > p').innerText += " also controlled by super element"; 
    }
}

function main() {
    customElements.define('sub-element', SubElement);
    customElements.define('sup-element', SupElement);

    document.querySelector('#container').append(document.createElement('sup-element'));
}

main();