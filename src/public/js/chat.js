const socket = io();
const chatBox = document.getElementById('chatBox');
const sendMsgBtn = document.getElementById('sendMsgBtn');
const messageLogs = document.getElementById('messageLogs');
const chatAvatar = document.getElementById('chatAvatar');
const chatPlaceholder = document.getElementById('chatPlaceholder');

async function getUser() {
    const res = await fetch(`api/sessions/current`, { method: "GET" });
    const data = await res.json();
    return data.payload;
}

sendMsgBtn.addEventListener('click', async () => {
    const user = await getUser();
    if (chatBox.value.trim().length > 0) {
        socket.emit('message', {
            user: user.first_name,
            email: user.email,
            message: chatBox.value
        })
        chatBox.value = '';
    }
})

chatBox.addEventListener('keyup', async event => {
    const user = await getUser();
    if (event.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user: user.first_name,
                email: user.email,
                message: chatBox.value
            })
            chatBox.value = '';
        }
    }
})

socket.on('logs', async data => {
    let messages = '';
    const user = await getUser();
    chatPlaceholder.style.display = "none";
    data.forEach(element => {
        if (element.email == user.email) {
            messages += `
            <div class="w-100 d-flex flex-row align-items-end gap-1 mt-2">
                <p style="margin-bottom: -6px; max-width: 150px;" class="text-break">${element.user}</p>
                <p style="margin-bottom: -3px; border-radius: 15px 15px 15px 0; max-width: 350px;" class="text-break p-1 px-3 bg-primary text-white">${element.message}</p>
            </div>`
        } else {
            messages += `
            <div class="w-100 d-flex flex-row align-items-end justify-content-end gap-1 mt-2">
                <p style=" margin-bottom: -3px;border-radius: 15px 15px 0px 15px; max-width: 350px;" class="text-break p-1 px-3 bg-primary text-white">${element.message}</p>
                <p style="margin-bottom: -6px; max-width: 150px;" class="text-break">${element.user}</p>
            </div>`
        }
    })
    messageLogs.innerHTML = messages;
    messageLogs.scrollTop = messageLogs.scrollHeight;
})

window.onload = async function () {
    const user = await getUser();
    console.log(user)
    if (user.documents.profile_pic.status) {
        const src = user.documents.profile_pic.reference.split('public')
        chatAvatar.src = `${src[1]}`;
        chatAvatar.alt = `${user.documents.name}`
    }
}



