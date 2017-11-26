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
    
        socket.on('message', (message) => {
            console.log(message);           
        });
    
    });
   
http.listen(5000, () => {
    console.log('Server started on port 5000');
});

app.listen(port, () => {
    console.log('server started on port '+port);
});