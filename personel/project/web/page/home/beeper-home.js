import {html, LitElement} from "lit";
import "../../components/beep-view.js";

class BeeperHome extends LitElement {
    static properties = {
        beepList: {
            state: true,
        },
    };





    constructor() {
        super();
        this.beepList = [];
        const messageSender = document.querySelector("#message-sender");
        messageSender.addEventListener("submit", (event) => this.handlePostBeep(event));
    }

    async deleteBeep(event) {
        const response = await fetch("/api/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ beepId: event.target.beep.id }),
        });
        if (!response.ok) {
            console.error("Failed to delete beep");
        } else {
            this.beepList = this.beepList.filter((b) => b.id !== event.target.beep.id);
        }
    }

    async handlePostBeep(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const content = formData.get("message");

        const response = await fetch("/api/beep", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: content }),
        });
        const newBeep = await response.json()
        this.beepList = [newBeep, ...this.beepList];
        form.reset();
    }

    async connectedCallback() {
        super.connectedCallback();
        const response = await fetch("/api/home");
        this.beepList = await response.json();
    }

    createRenderRoot() {
        return this;
    }
    render() {
        return html`${this.beepList.map(
            (b) => html`<beep-view @beep-deleted=${this.deleteBeep} beep="${JSON.stringify(b)}"></beep-view>`
        )}`;
    }
}

customElements.define("beeper-home", BeeperHome);