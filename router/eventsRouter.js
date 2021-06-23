const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {body , validationResult} =require('express-validator');
const Event = require('../models/Event');



/*
UPLOAD Events

   Event Router
   Usage : Upload an Event
   URL : http://127.0.0.1:5000/api/events/upload
   params : name , image , date , type , price , info
   method : post
   access : Private
   */

router.post('/upload' ,authenticate , [
    body('name').notEmpty().withMessage('Name required'),
    body('image').notEmpty().withMessage('Image required'),
    body('date').notEmpty().withMessage('Date Required'),
    body('type').notEmpty().withMessage('Type Required'),
    body('price').notEmpty().withMessage('Price Required'),
    body('info').notEmpty().withMessage('Information Required')
] , async (request , response)=>{

    let error = validationResult(request);
    if (!error.isEmpty()) {
        return response.status(401).json({error : error.array()});
    }

    try {
        let {name , image , date , type , price , info} = request.body;
        let user = request.user.id;
       let event = new Event({user , name , image , date , type , price , info});
        event = await event.save();
        response.status(200).json({
            msg : 'Event Upload success.',
            event : event
        });

    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error : [{msg : error.message}]});

    }
});


/*4)

FREE Events

Event Router
Usage : Get FreeEvents Events
URL : http://127.0.0.1:5000/api/events/free
    params : no-fields
method : get
access : Public
*/
router.get('/free' , async (request , response)=>{
    try {

        let events = await Event.find({type : 'FREE'});
        response.json({event:events});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error : [{msg : error.message}]});

    }
});

/*

5)
 PRO Events
   Event Router
   Usage : Get ProEvents Events
   URL : http://127.0.0.1:5000/api/events/pro
   params : no-fields
   access : Private
   method : get
*/

router.get('/pro' ,authenticate , async (request , response)=>{
    try {
        let events = await Event.find({type : 'PRO'});
        response.json({event:events});
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error : [{msg : error.message}]});
    }
});






module.exports = router;