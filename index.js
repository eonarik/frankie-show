require('babel/register')({});

const fs = require('fs');
const app = require('./server');;
const bodyParser = require("body-parser");
const http = require('https');
// const socket = require('socket.io')(http);
const https_options = {
    key: fs.readFileSync('serts/frankie-show-key.pem'),
    cert: fs.readFileSync('serts/frankie-show-cert.pem'),
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const PORT = process.env.PORT || 8080;

app.use('/dist', express.static('dist'));
app.use('/static', express.static('static'));

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    // res.send('hello');
});

http.createServer(https_options, app).listen(PORT, function () {
    console.log('Server running on port ', PORT);
});