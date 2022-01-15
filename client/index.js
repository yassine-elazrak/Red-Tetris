const form = document.getElementById('chat-form');
const messageBox = document.getElementById('messageBox');
const chatBox = document.getElementById('chat-box')

const socket = io('localhost:3000');

  socket.on('message', (msg) => {
    const liTag = document.createElement('li');
    liTag.classList.add('list-group-item')
    liTag.innerText = msg;

    chatBox.appendChild(liTag)
  })


form.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('message', messageBox.value)
  console.log(messageBox.value)
  messageBox.value = ''
  res = fetch('http://localhost:3000/test', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: messageBox.value
    })
})
   console.log(res)
})