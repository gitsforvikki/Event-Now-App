
// mongoDB Database creation
const  mongoose = require('mongoose');

////mongoDB Database table schema/structure

//name , image , date , type , price , info , created
const EventSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'user' , required : true},
    name : {type : String , required :true},
    image : {type :  String , require : true},
    date : {type : String , required:true},
    type : {type : String , required : true },
    price : {type : Number , required : true },
    info : {type : String , required :true},
    created : {type : Date , default : Date.now}

});

const  Event = mongoose.model('event' , EventSchema);

module.exports = Event;