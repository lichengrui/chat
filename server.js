// Command to start server: npm run devStart

const io = require('socket.io')(3000)

const users = {}
var roles = []

function generateRoles(num_players){
  switch(num_players){
    case 3:
      roles = ['Werewolf', 'Werewolf', 'Seer', 'Robber', 'Troublemaker', 'Villager'];
      break;
    case 4:
      roles = ['Werewolf', 'Werewolf', 'Seer', 'Robber', 'Troublemaker', 'Villager', 'Villager'];
      break;
    case 5:
      roles = ['Werewolf', 'Werewolf', 'Seer', 'Robber', 'Troublemaker', 'Villager', 'Villager', 'Villager'];
      break;
    default:
      roles = ['Werewolf', 'Seer', 'Robber'];
      break;
  }
}

function* roleDistributor(){
  var index;

  while(roles.length > 0){
    index = Math.floor(Math.random() * roles.length);
    yield roles.splice(index, 1);
  }
}

io.on('connection', socket => {
    socket.on('new-user', name =>{
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })
    socket.on('start-game', () =>{
        num_players = Object.getOwnPropertyNames(users).length
        generateRoles(num_players)

        console.log('Number of Players:', num_players)

        for(player_idx in Object.getOwnPropertyNames(users)){
          role = roleDistributor().next().value
          user = Object.getOwnPropertyNames(users)[player_idx]
          io.to(`${user}`).emit('role-given', role);
        }
    })
    socket.on('disconnect', () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
