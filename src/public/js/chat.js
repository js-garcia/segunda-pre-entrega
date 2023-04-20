const socket = io();

const chatForm = document.getElementById("chatForm")
const chatBox = document.getElementById("chatBox")
const msgAuthor = document.getElementById("author")
const msgEmail = document.getElementById("email")
const msgText = document.getElementById("message")

window.addEventListener("load", () => {
    socket.emit("load messages")
})

socket.on("allMessages", async message => {
    chatBox.textContent = ''
    message.forEach(message => {
        let date = new Date(message.date)
        const dateOpts = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        }
        chatBox.textContent += `[${new Intl.DateTimeFormat('es-AR', dateOpts).format(date)}] ${message.name} (${message.email}): ${message.message}\n`
    })
})

chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    console.log(msgAuthor.value)
    console.log(msgEmail.value)
    console.log(msgText.value)
    
    if (msgAuthor.value && msgEmail.value && msgText.value) {
        const newMessage = {
            name: msgAuthor.value,
            email: msgEmail.value,
            message: msgText.value,
            date: this.date
        }
        
        socket.emit("message", newMessage)
        msgText.value = ""
        scrollDown()
    } else {
        alert("Por favor completar todos los campos.")
    }
    
});

function scrollDown() {
    chatBox.scrollTop = chatBox.scrollHeight
}