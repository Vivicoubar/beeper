
const messageData = {
    message: "Hello world",
    author: "Auteur",
    date: new Date(),
    likes: 0
}

const messageSender = document.querySelector("#message-sender");
messageSender.addEventListener("submit", handleWithComponent);


function handleWithComponent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const message = formData.get("message");
    const messageElement = document.createElement("message-element");
    messageElement.setAttribute("message", message);
    messageElement.setAttribute("author", "Auteur");
    messageElement.setAttribute("date", new Date());
    messageElement.setAttribute("likes", Math.round(Math.random() * 100).toString());
    const messageFeed = document.querySelector("#message-feed");
    messageFeed.prepend(messageElement);
    event.target.reset();
}
async function handleMessage(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        body: formData
    }).then((response) =>
        {
            if (!response.ok) {
                console.error("Error:", response.status, response.statusText);
                return;
            }
            response.json().then((data)=> {
                const message = data.content;
                const messageElement = document.querySelector("#message-template").content.cloneNode(true);
                messageElement.querySelector(".message-content").textContent = message;
                const messageFeed = document.querySelector("#message-feed");
                messageFeed.prepend(messageElement);
                event.target.reset();
            })
        }
    );
}


