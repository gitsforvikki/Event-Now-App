const express = require('express');

//initialise express
const app = express();

const dotEnv = require('dotenv');
const mongoose = require('mongoose');

const  cors = require('cors');
const path = require('path');

//configure cors
app.use(cors());

//configure express to receive form data
app.use(express.json());

//configure dotEnv
dotEnv.config({path : './.env'});


//const hostname = process.env.LOCAL_HOST_NAME;
// const port = process.env.LOCAL_PORT;

const port = process.env.PORT || 5000;

// connect to mongoDB
mongoose.connect(process.env.MONGO_DB_CLOUD_URL , {
    useFindAndModify : false,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex : true
}).then((response)=>{
    console.log('Connect to MongoDb cloud successfully......! ');
}).catch((error)=>{
    console.log(error);
    process.exit(1);
});


/*
//basics request
app.get('/' , (request , response)=>{
    response.send(`<h2>Welcome to Event Now Application Backend</h2>`);
});
*/
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , 'client' , 'build')));
    app.get('/', (request,response) => {
        response.sendFile(path.join(__dirname , 'client' , 'build' , 'index.html'));
    });
}

// router configuration
app.use('/api/users' , require('./router/userRouter'));
app.use('/api/events' , require('./router/eventsRouter'));


app.listen(port , ()=>{
    console.log(`Express server is started at PORT : ${port}`);
});