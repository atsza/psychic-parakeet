const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const http = require('http').Server(app);
const io = require('socket.io')(http);


mongoose.connect(config.database,  { useMongoClient: true });

mongoose.connection.on('connected', () =>
{
console.log("MongoDb Connected");
});

mongoose.connection.on('error', (err) =>
{
console.log("MongoDb Connection Failed"+err);
});


const port =3000;




const users = require('./routes/users');  


//cors middleware
app.use(cors());

//Static file
app.use(express.static(path.join(__dirname, 'public')));


//Body parser

app.use(bodyParser.json());

//SOCKET
app.use(bodyParser.urlencoded({ extended: true }))

//PassPort Middleware

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.use('/users', users);   

//index route
app.get('/',(req,res) =>
{
res.send('Server is running')
//res.json("test");

});



/*
app.get('*',(req,res) =>
{
res.sendFile(path.join(__dirname, 'public/index.html'));
});
*/

io.on('connection', (socket) => {
    
        console.log('user connected');
    
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
    
        socket.on('lobby_request', (token) => {
           io.sockets.emit('lobby_request', token);
        });

        socket.on('lobby_response', (tokens) => {
            io.sockets.emit('lobby_response', tokens);
         });
         socket.on('game_accept', (tokens) => {
            console.log('Game started! Players: \n' +  tokens.from + '\n' +  tokens.to);
            io.sockets.emit('game_accept', { Player1: tokens.from, Player2: tokens.to });
         });
         socket.on('game_event', (data) => {
            console.log('Turn played! Payload:' + data.next_player_token);
            io.sockets.emit('game_event', { data });
         });
    });
   
http.listen(5000, () => {
    console.log('Server started on port 5000');
});

app.listen(port, () => {
    console.log('server started on port '+port);
});