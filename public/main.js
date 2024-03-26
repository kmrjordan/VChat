const socket = io();

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', updateClientsTotal);

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    const data = {
        name: nameInput.value.trim() || 'anonymous',
        message,
        dateTime: new Date(),
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    const listItem = document.createElement('li');
    listItem.classList.add(isOwnMessage ? 'message-right' : 'message-left');
    
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('message');

    const username = data.name.trim() || 'Anonymous';
    const messageText = data.message.trim();
    messageParagraph.textContent = `${username} : ${messageText ? messageText + ' ' : ''}`;
    
    listItem.appendChild(messageParagraph);
    messageContainer.appendChild(listItem);
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function updateClientsTotal(data) {
    clientsTotal.innerText = `Active : ${data}`;
}
