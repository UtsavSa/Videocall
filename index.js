const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('offer', data => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', data => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', data => {
    socket.broadcast.emit('candidate', data);
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});
