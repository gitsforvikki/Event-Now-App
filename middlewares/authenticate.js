const  jwt = require('jsonwebtoken');



let authenticate = (request , response , next)=>{
    //get token from header
    let token = request.header('x-auth-token');
    if (!token){
        return response.status(401).json({msg : 'No Token , authorization denied'});
    }
    //if token available , then ,verify the token
    let decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    request.user = decoded.user;
    next();
};

module.exports = authenticate;