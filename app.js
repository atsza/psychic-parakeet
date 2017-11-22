const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database,  { useMongoClient: true });

mongoose.connection.on('connected', () =>
{
console.log("MongoDb Connected");
});

mongoose.connection.on('error', (err) =>
{
console.log("MongoDb Connection Failed"+err);
});

const app = express();

const port =3000;




const users = require('./routes/users');  


//cors middleware
app.use(cors());

//Static file
app.use(express.static(path.join(__dirname, 'public')));


//Body parser

app.use(bodyParser.json());

//PassPort Middleware

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.use('/users', users);   

//index route
app.get('/',(req,res) =>
{
res.send("test");
});

app.get('*',(req,res) =>
{
res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, () => {
    console.log('server started on port '+port);
});