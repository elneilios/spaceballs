var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var balls = {};
var shots = {};

app.listen(8080);

io.configure(function() {
    io.set("transports", ["websocket"]);
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {  

  socket.on('updateball', function(ball){

    if(ball)
      balls[socket.id] = ball;
    else
      balls[socket.id] = undefined;

    socket.broadcast.emit('onupdateballs', balls);

  });

  socket.on('updateshots', function(playerShots){

    if(playerShots)
      shots[socket.id] = playerShots;
    else
      shots[socket.id] = undefined;

    socket.broadcast.emit('onupdateshots', shots);

  });

  socket.on('disconnect', function(){
    balls[socket.id] = undefined;
    shots[socket.id] = undefined;
    socket.broadcast.emit('onupdate', balls);
  });

  socket.emit('connected', socket.id);
  socket.emit('onupdate', balls);
  
});

// setInterval(function(){
//   io.sockets.emit('onupdate', balls);
// }, 50);