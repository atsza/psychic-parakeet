const express = require('express');
const router =  express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
 const config =require('../config/database');

//Register
router.post('/register', (req, res, next) =>
{ 
 newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
});

User.addUser(newUser, (err, user) =>
{
    if(err)
{
    res.json({success: false, msg:'Failed to register user'});
}
else{
    res.json({success: true, msg:'User Register'});
}

}) ;
});


//Authenticate
router.post('/authenticate', (req,res,next) =>
{
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err,user) =>
{
if(err) throw err;
if(!user){
    return res.json({success: false, msg: 'User not found'});
}
User.comparePassword(password, user.password, (err, isMatch) =>{

    if(err) throw err;
    if(isMatch)
    {
        const token = jwt.sign({data: user}, config.secret, {
        expiresIn: 604800
        });
        res.json({
            success: true,
            token: 'JWT '+token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    else
    {
        return res.json({success: false, msg: 'Wrong Password'});
    }
});
});
}) ;


//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req,res,next) =>
{
res.json({user: req.user});
}) ;


router.get('/game',(req,res,next) =>
{
    console.log("gamestart");
    res.json('g');
}) ;

router.post('/game', (req, res, next) =>
{ 
    console.log("gamestart");
    res.json('g');
}
);

//Validate
router.get('/validate', (req,res,next) =>
{
res.send('Validate');
}) ;


module.exports = router;
