const socket = io()
let user = ''
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: 'Autenticación',
    input: 'text',
    text: 'Ingrese su email para utilizar el chat',
    inputValidator: value =>{
        return !value.trim() && 'Por favor ingrese su mail'
    },
    allowOutsideClick: false
}).then( result =>{
    user = result.value
    document.getElementById('userName').innerHTML = user
})

chatBox.addEventListener('keyup', event =>{
    if(event.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
        }
    }
})

socket.on('logs', data =>{
    const messageLogs = document.getElementById('messageLogs')
    let messages = ''
    data.reverse().forEach(element => {
        messages += `<div>${element.user}: ${element.message}</div>`  
    })
    messageLogs.innerHTML = messages
})