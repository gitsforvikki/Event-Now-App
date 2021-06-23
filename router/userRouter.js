const express = require('express');
const router = express.Router();
const {body , validationResult} = require('express-validator');
const User = require('../models/User.js');

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
/*1)

Register User
   User Router
   Usage : Register a User
   URL : npm
   params : name , email , password
   method : post
   access : Public
   */

router.post('/register',[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
] ,async (request , response)=>{

    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()})
    }
    try {

        let {name , email , password} = request.body;

        // check if user already exists or not
        let user = await User.findOne({email : email});
        if(user){
            return response.status(401).json({errors : [{msg : 'User is Already Exists'}]})
        }

        // encrypt the password
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password , salt);

        // avatar url
        let avatar = gravatar.url(email , {
            s : '200',
            r : 'pg',
            d : 'mm'
        });

        let isAdmin = false;

        // save to db
        user = new User({name , email , password , avatar , isAdmin});
        user = await user.save();

        response.status(200).json({
            msg : 'Registration successful.'
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ errors : [{msg : error.message}]});
    }
});

/*
2)
Login users

   User Router
   Usage : Login a User
   URL : http://127.0.0.1:5000/api/users/login
   params : email , password
   method : post
   access : Public
*/

router.post('/login' ,[
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
] , async (request , response)=>{

    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()})
    }

    try {
        let {email  , password} = request.body;
        //check if user exist or not
        let user  = await User.findOne({email : email});
        if (!user){
            return response.status(401).json({error : [{msg : 'Invalid Credentials.'}]});
        }
        //check password
        let isMatch = await bcrypt.compare(password , user.password);
        if (!isMatch){
            return response.status(401).json({error : [{msg : 'Invalid Credentials.'}]});
        }
        //create jsonWebToken (JWT)
        let payload = {
            user : {
                id : user.id,
                name : user.name
            }
        };
        jwt.sign(payload  , process.env.JWT_SECRET_KEY , (error , token)=>{
            if (error) throw  error;
            response.status(200).json({
                msg : 'Login success.',
                token : token,
                user:user
            });
        });
        }
    catch (error) {
        console.log(error);
        response.status(500).json({ error : [{msg : error.message}]});

    }
});

/*
2)
   User Router
   Usage : get user data
   URL : http://127.0.0.1:5000/api/users/
   params : email , password
   method : post
   access : Private
*/
router.get('/' , authenticate , async (response , request)=>{

    try {
        let user = await User.findOne({_id:request.user.id});
        response.status(200).json({user : user});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error : [{msg : error.message}]});

    }
});








module.exports = router;