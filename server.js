const Express = require('express');
const SockJS = require('sockjs');
const path = require('path');

const app = Express();
const http = require('http').Server(app);
const socket = SockJS.createServer();

const PORT = process.env.PORT || 8080;

app.use('/dist', Express.static('dist'));
app.use('/static', Express.static('static'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var connList = [];
socket.on('connection', function (conn) {
    connList[conn.id] = conn;
    // conn.on('data', function (message) {
    //     for (var i in connList) {
    //         connList[i].write(message);
    //     }
    // });
    conn.on('close', function () {
        console.info('Connection closed');
    });
});

socket.installHandlers(http, { prefix: '/ws' });

http.listen(PORT, function () {
    console.log('Server running on port ' + PORT + '.');
});