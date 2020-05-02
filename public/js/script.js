const socket = io('http://localhost:3000')
const gameStart = document.getElementById("start-game")
const messageForm = document.getElementById("user-chat-input")
const sendButton = document.getElementById("send-button")
const messageInput = document.getElementById("message-input")
const messageContainer = document.getElementById('message-container')
const playerContainer = document.getElementById('player-container')

const name = prompt('What is your name?')
appendMessage('You Joined')
socket.emit('new-user', name)

socket.on ('chat-message', data=>{
    appendMessage(`${data.name}: ${data.message}`)
})

socket.on ('user-connected', name=>{
    appendMessage(`${name} connected`)
})

socket.on ('role-given', role=>{
    appendMessage(`Your role is ${role}`)
})

socket.on ('test', e=>{
    appendMessage(`Testing`)
})

socket.on ('user-disconnected', name=>{
    appendMessage(`${name} disconnected`)
})

socket.on ('player-list', data => {
    for(var i = 0; i < data.playerNumArray.length; i++){
      appendPlayer(data.playerNumArray[i], data.nameArray[i])
    }
})

socket.on ('create-button', buttonArray => {
    for(var playerIndex in buttonArray){
      var buttonElement = document.createElement('button')
      buttonElement.innerText = "Vote"
      buttonElement.setAttribute("class", "btn btn-secondary")
      buttonElement.setAttribute("id", "playerIndex-" + playerIndex)

      var playerInfo = document.querySelectorAll("#player-container div")[playerIndex]
      playerInfo.append(buttonElement)
    }
})

gameStart.addEventListener('click', e=> {
  e.preventDefault()
  socket.emit('start-game')
})

messageForm.addEventListener('submit', e=> {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

sendButton.addEventListener('click', e=> {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', message)
    messageInput.value = ''
})

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
    updateScroll();
}

function updateScroll(){
  var element = document.querySelector(".chat-container");
  element.scrollTop = element.scrollHeight;
}

function appendPlayer(playerNum, playerName){
  const messageElement = document.createElement('div')
  messageElement.innerText = `${playerNum}. ${playerName}`
  playerContainer.append(messageElement)
}
