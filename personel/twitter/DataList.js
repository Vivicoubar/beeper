import {html, css , LitElement} from 'lit';
import formatDistanceToNow from 'formatDistanceToNow';
class DataList extends LitElement {
    static properties = {
    };
    constructor() {
     super()
        this.data = []
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div class="card mb-2">
                ${this.data.map((item) => html`
                
                `)}
            </div>`
    }
}
customElements.define('data-list', DataList);