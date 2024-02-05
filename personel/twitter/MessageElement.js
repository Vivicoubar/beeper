import {html, css , LitElement} from 'lit';
import formatDistanceToNow from 'formatDistanceToNow';
class MessageElement extends LitElement {
    static properties = {
        message: {type: String},
        author: {type: String},
        date: {type: Date},
        likes: {type: Number}
    };
    constructor() {
        super();
        this.likes = 0;
        this.message = "";
        this.author = "";
        this.date = "";
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div class="card mb-2">
                <div class="card-header">
                    ${this.author} - ${formatDistanceToNow(this.date)}
                </div>
                <div class="card-body">
                    <p class="card-text">${this.message}</p>
                    <span>${this.likes} like(s)</span>
                    <a href="#" class="">Liker</a>
                    <a href="#" class="">Répondre</a>
                </div>`
    }
}
customElements.define('message-element', MessageElement);