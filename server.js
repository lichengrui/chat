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
        var playerNum = 1;
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

        for(var i = 0; i < socketIdArray.length; i++){
          var user = sockets[socketIdArray[i]];
          console.log(user);
          user['playerNum'] = playerNum;
          user['role'] = roleArray[playerNum];
          playerNumArray.push(playerNum);
          playerNum++;
          nameArray.push(user['name']);
        }

        for(i = playerNum; i <= socketIdArray.length + 3; i++){
          playerNumArray.push(i);
          nameArray.push('Card');
        }

        For Needed Inputs:
          1: One of the other assigned roles
          2: Two of the other assigned roles
          3: One assigned role OR Two unassigned roles
          4: One unassigned role

        for(i = 0; i < socketIdArray.length; i++){
          console.log(i);
          console.log(socketIdArray[i]);
          io.to(socketIdArray[i]).emit('player-list', {playerNumArray: playerNumArray, nameArray: nameArray});
          io.to(socketIdArray[i]).emit('chat-message', {message: messageArray[i], name: 'System'});

          var buttonArray = [];

          for(var numButtons = 0; numButtons < inputArray[i]; numButtons++){
            buttonArray.push(numButtons);
          }

          io.to(socketIdArray[i]).emit('create-button', buttonArray);
        }
    })
    socket.on('vote', () =>{
        var socketIdArray = Object.getOwnPropertyNames(sockets);

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
