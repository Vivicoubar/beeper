import {html, LitElement} from "lit";

class BeepView extends LitElement {
    static properties = {
        beep: {
            type: Object,

        },
    };

    constructor() {
        super();
        this.beep = null;
    }


    async handleLikeBeep(event) {
        const response = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ beepId: this.beep.id }),
        });
        const newLikeCount = await response.json();
        this.beep = {...this.beep, likeCount:newLikeCount, liked:true};

    }

    async handleUnlikeBeep(event) {
        const response = await fetch("/api/unlike", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ beepId: this.beep.id }),
        });
        const newLikeCount = await response.json();
        this.beep = {...this.beep, likeCount:newLikeCount, liked:false};


    }

    async handleBeepDelete() {
        const customEvent = new Event("beep-deleted", {beepid: this.beep.id});
        this.dispatchEvent(customEvent);
    }

    createRenderRoot() {
        return this;
    }
    render() {
        return html`
            <div class="">
              <div class="card text-bg-dark mb-2">
                  <div class="card-header">
                      <img
                        src="${this.beep.authorPicture}"
                        alt="Profile picture of ${this.beep.authorName}"
                        class="author-profile-picture"/>
                      <span class="card-header-element card-header-username"> ${this.beep.authorName}</span>
                      <span class="card-header-element card-header-infos">${new Date(this.beep.createdAt).toLocaleString()}</span>
                  </div>
                  <div class="card-body">
                      <p class="card-text">${this.beep.content}</p>
                  </div>
                  <div class="card-footer">
                      <span class="card-header-element card-header-infos">
                          <span class="like" @click=${this.beep.liked ? this.handleUnlikeBeep: this.handleLikeBeep}>${this.beep.likeCount} ${this.beep.liked ? "❤️" : "♡"}</span>
                          <span class="delete" @click=${this.handleBeepDelete}>🗑️</span>
                      </span>
                      <div class="accordion bg-dark mt-2">
                          <div class="accordion-item bg-dark">
                              <h2 class="accordion-header bg-dark">
                                    <button class="text-bg-dark accordion-button bg-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${this.beep.id}" aria-expanded="true" aria-controls="collapse${this.beep.id}">
                                        Comments
                                    </button>
                                </h2>
                          </div>
                            <div id="collapse${this.beep.id}" class="accordion-collapse collapse bg-dark" aria-labelledby="heading${this.beep.id}" data-bs-parent="#accordionExample">
                                <div class="accordion-body bg-dark">
                                    <comment-view>Blabla</comment-view>
                                </div>  
                      </div>
                  </div>
              </div>
            </div>`;
    }

}

customElements.define("beep-view", BeepView);