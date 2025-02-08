const { crackTheJWTToken } = require("../services/auth")

async function checkForAuthentication(req,res,next){  
        const cookieValue = req.cookies['token']
        if(!cookieValue){
            return res.status(401).json({ authenticated: false, message: 'No token provided' });
        }
        try {
            const userPayLoad = await crackTheJWTToken(cookieValue) 
            if(!userPayLoad){
                return res.status(401).json({ authenticated: false, message: 'User not found' });
            }
            return res.status(200).json({ authenticated: true, user: userPayLoad });
        } catch (error) {
            return res.status(401).json({ authenticated: false, message: 'Invalid token' });
        }    
}

module.exports = checkForAuthentication