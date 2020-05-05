const socket = io('http://localhost:3000')
const gameStart = document.getElementById("start-game")
const messageForm = document.getElementById("user-chat-input")
const sendButton = document.getElementById("send-button")
const messageInput = document.getElementById("message-input")
const messageContainer = document.getElementById('message-container')
const playerContainer = document.getElementById('player-container')
var voteButton = document.querySelectorAll('voteButton')

const name = prompt('What is your name?')
appendMessage('You Joined')
socket.emit('new-user', name)

var playerVoteLimit;
var cardVoteLimit;
var playerVote = [];
var cardVote = [];

var choicesLength;

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
    choicesLength = data.playerNumArray.length;

    for(var i = 0; i < choicesLength; i++){
      appendPlayer(data.playerNumArray[i], data.nameArray[i])
    }
})

socket.on ('create-button', data => {
    playerVoteLimit = data.buttonChoices[0];
    cardVoteLimit = data.buttonChoices[1];
    playerVote.length = 0;
    cardVote.length = 0;

    for(var playerIndex in data.buttonArray){
      // appendMessage('System: ' + playerIndex);
      // console.log(playerIndex);
      var buttonElement = document.createElement('button')
      buttonElement.innerText = "Vote"
      buttonElement.setAttribute("class", "btn btn-secondary voteButton")
      var gamePlayerIndex = Number(playerIndex) + 1;
      buttonElement.setAttribute("id", "playerIndex-" + gamePlayerIndex)
      buttonElement.addEventListener('click', e => {
      var buttonNumber = event.target.id.substr(12);

        if(buttonNumber <= choicesLength - 3){
          switch(playerVoteLimit){
            case 1:
              if(cardVoteLimit == 2 && cardVote.length > 0){
                appendMessage('System: You picked ' + buttonNumber + ' instead of picking a card');
                cardVote.length = 0;
              }else{
                appendMessage('System: You picked ' + buttonNumber);
              }

              if(playerVote.length == 1){
                playerVote[0] = buttonNumber;
              }else{
                playerVote.push(buttonNumber);
              }

              break;

            case 2:
              switch(playerVote.length){
                case 2:
                  if(playerVote[1] == buttonNumber){
                    appendMessage('System: You picked ' + buttonNumber + ' already.');
                  }else{
                    appendMessage('System: You picked ' + buttonNumber + ' instead of ' + playerVote[0]);
                    playerVote[0] = playerVote[1];
                    playerVote[1] = buttonNumber;
                  }

                  break;

                case 1:
                  appendMessage('System: You also picked '+ buttonNumber);
                  playerVote.push(buttonNumber);

                  break;

                case 0:
                  appendMessage('System: You picked ' + buttonNumber);
                  playerVote.push(buttonNumber);

                  break;

                default:
                  appendMessage('System: ERROR')
              }

              break;

            default:
              appendMessage('System: ERROR');
          }
        }else{
          switch(cardVoteLimit){
            case 1:
              appendMessage('System: You picked '+buttonNumber);
              cardVote.push(buttonNumber);

              break;

            case 2:
              if(cardVote.length == 1){
                appendMessage('System: You also picked '+ buttonNumber);
                cardVote.push(buttonNumber);
              }else{
                appendMessage('System: You picked ' + buttonNumber);
                cardVote.push(buttonNumber);
              }
              
              break;

            default:
              appendMessage('System: ERROR');
          }
        }
      })

      var playerInfo = document.querySelectorAll("#player-container div")[playerIndex];
      playerInfo.append(buttonElement);
    }
})

socket.on('timer', data => {
    gameStart.innerText = data.clockTimer;

    if(data.done){
      gameStart.classList.remove("btn-outline-dark");
      gameStart.classList.add("btn-danger");
    }
})

socket.on('retrieve-vote', () => {
    socket.emit('vote', {playerVote: playerVote, cardVote: cardVote});
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

//Work on Vote Button
// voteButton.forEach((btn) => {
//   btn.addEventListener('click', e => {
//     socket.emit('vote', this.id + 'yo');
//   })
// })

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
