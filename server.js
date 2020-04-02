// Command to start server: npm run devStart

const io = require('socket.io')(3000)

const users = {}

function* roleDistributor(){
  let roles = ['Liberal', 'Fascist', 'Hitler'];
  var index;

  while(roles.length > 0){
    index = Math.floor(Math.random() * roles.length);
    console.log(roles);
    yield roles.splice(index, 1);
  }
}

io.on('connection', socket => {
    socket.on('new-user', name =>{
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
        role = roleDistributor().next().value
        socket.emit('role-given', {name: users[socket.id], role: role});
    })
    socket.on('send-chat-message', message=>{
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})
    })
    socket.on('disconnect', () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
