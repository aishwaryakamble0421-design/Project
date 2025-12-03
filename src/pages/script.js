const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const clearBtn = document.getElementById("clearChat");

function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.classList.add("message");

    msg.innerHTML = `
        <div class="bubble" style="background:#4d6aff; margin-left:auto;">
            ${text}
        </div>
    `;

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function addAIMessage(text) {
    const msg = document.createElement("div");
    msg.classList.add("message", "ai");

    msg.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" class="ai-icon">
        <div class="bubble">${text}</div>
    `;

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
    let text = userInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    userInput.value = "";

    setTimeout(() => {
        addAIMessage("I'm still learning! Please ask about trending skills.");
    }, 600);
});

clearBtn.addEventListener("click", () => {
    messages.innerHTML = "";
});


