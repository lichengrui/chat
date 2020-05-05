// Command to start server: npm run devStart
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http)

const sockets = {};
var roles = [];

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', socket => {
    socket.on('new-user', name =>{
        var user = {};
        user['name'] = name;
        sockets[socket.id] = user;
        socket.broadcast.emit('user-connected', user['name']);
    })
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', {message: message, name: sockets[socket.id]['name']});
    })
    socket.on('start-game', () =>{
        var socketIdArray = Object.getOwnPropertyNames(sockets);

        var roleAssignArray = roleAssign(socketIdArray.length);
        var roleArray = roleAssignArray[0];
        var messageArray = roleAssignArray[1];
        var inputArray = roleAssignArray[2];

        console.log("---Roles---");
        console.log(roleArray);
        console.log("---Messages---");
        console.log(messageArray);
        console.log("---Inputs---");
        console.log(inputArray);

        var playerNumArray = [];
        var nameArray = [];
        var user;

        for(var i = 0; i < socketIdArray.length; i++){
          user = sockets[socketIdArray[i]];
          console.log(user);
          user['playerNum'] = i + 1;
          user['role'] = roleArray[i];
          playerNumArray.push(i + 1);
          nameArray.push(user['name']);
        }

        for(i = i + 1; i <= socketIdArray.length + 3; i++){
          playerNumArray.push(i);
          nameArray.push('Card');
        }

        // For Needed Inputs:
        //   1: One of the other assigned roles
        //   2: Two of the other assigned roles
        //   3: One assigned role OR Two unassigned roles
        //   4: One unassigned role

          for(i = 0; i < socketIdArray.length; i++){
            console.log('i: ' + i);
            io.to(socketIdArray[i]).emit('player-list', {playerNumArray: playerNumArray, nameArray: nameArray});
            io.to(socketIdArray[i]).emit('chat-message', {message: messageArray[i], name: 'System'});

            var buttonArray = [];
            var buttonChoices = [];
            var numButtons;

            console.log('Input: ' + inputArray[i]);
            switch(inputArray[i]){
              case 1:
                for(numButtons = 0; numButtons < socketIdArray.length; numButtons++){
                  buttonArray.push(numButtons);
                }
                buttonChoices = [1, 0];
                break;
              case 2:
                for(numButtons = 0; numButtons < socketIdArray.length; numButtons++){
                  buttonArray.push(numButtons);
                }
                buttonChoices = [2, 0];
                break;
              case 3:
                for(numButtons = 0; numButtons < socketIdArray.length + 3; numButtons++){
                  buttonArray.push(numButtons);
                }
                buttonChoices = [1, 2];
                break;
              case 4:
                for(numButtons = socketIdArray.length; numButtons < socketIdArray.length + 3; numButtons++){
                  buttonArray.push(numButtons);
                }
                buttonChoices = [0, 1];
                break;
            }

            console.log(buttonArray, buttonChoices);

            io.to(socketIdArray[i]).emit('create-button', {buttonArray: buttonArray, buttonChoices: buttonChoices});
          }

          var clockTimer = 0;

          var timer = setInterval( () => {
            clockTimer++;
            console.log(clockTimer);
            io.emit('timer', {clockTimer: clockTimer, done: false});
          }, 1000)

          setTimeout( () => {
            clockTimer++;
            io.emit('timer', {clockTimer: clockTimer, done: true});
            clearInterval(timer);
            console.log('60 seconds have passed.');
            io.emit('retrieve-vote');
          }, 60000);
    })
    socket.on('vote', data =>{
        user = sockets[socket['id']];
        console.log('playerVote :' + data.playerVote);
        console.log('cardVote :' + data.cardVote);
        user['playerVote'] = data.playerVote;
        user['cardVote'] = data.cardVote;
    })
    socket.on('disconnect', () =>{
        console.log(sockets);
        // socket.broadcast.emit('user-disconnected', sockets[socket.id]['name']);
        delete sockets[socket.id]
    })
})

http.listen(process.env.PORT || 3000, () => {
  console.log('Listening on *:');
})

function roleAssign(n) {
  var Roles = ["Villager","Werewolf","Seer","Robber","Troublemaker","Tanner","Drunk","Hunter","Mason","Insomniac","Minion"]
  var directions = ["Villagers do nothing at night","Werewolfs will know who the other werewolfs are at night", "Seers can choose two unassigned roles or another person's role to look at","Robber has to switch out their own role with another person's","Troublemaker switches two people's roles","Tanner's role is to die", "Drunk has to switch out their own role with another role in the middle", "There is another Mason in the village, you will know who it is", "Insomiac will have the opportunity to check their own role at the end of the night", "Minion will know who all of the werewolves are"]
  var needed_inputs = [0,0,3,1,2,0,4,0,0,0,0]
  /*
    For Needed Inputs:
      1: One of the other assigned roles
      2: Two of the other assigned roles
      3: One assigned role OR Two unassigned roles
      4: One unassigned role
  */
  var dist = []
  var list = []
  var shuffled_list = []
  var output_roles = []
  var output_directions = []
  var output_needed_inputs = []
  switch(n) {
    case 3:
      dist = [1,2,1,1,1,0,0,0,0,0,0]
      break;
    case 4:
      dist = [2,2,1,1,1,0,0,0,0,0,0]
      break;
    case 5:
      dist = [3,2,1,1,1,0,0,0,0,0,0]
      break;
    case 6:
      dist = [4,2,1,1,1,0,0,0,0,0,0]
      break;
    case 7:
      dist = [5,2,1,1,1,0,0,0,0,0,0]
      break;
    case 8:
      dist = [6,2,1,1,1,0,0,0,0,0,0]
      break;
    case 9:
      dist = [7,2,1,1,1,0,0,0,0,0,0]
      break;
    case 10:
      dist = [8,2,1,1,1,0,0,0,0,0,0]
      break;
    default:
      // code block
  }
  for (i = 0; i < dist.length; i++) {
    for (j = 0; j < dist[i]; j++) {
      list.push([Roles[i],directions[i],needed_inputs[i]])
    }
  }
  shuffled_list = shuffle(list)
  for (i = 0; i < shuffled_list.length; i++) {
    output_roles.push(shuffled_list[i][0])
    output_directions.push(shuffled_list[i][1])
    output_needed_inputs.push(shuffled_list[i][2])
  }
  return [output_roles,output_directions,output_needed_inputs];
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
