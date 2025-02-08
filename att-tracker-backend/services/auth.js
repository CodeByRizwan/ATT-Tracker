const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET

async function createJWTToken(theUser) {
    const userObject = theUser.toObject(); 
    const payload = {
        _id: userObject._id,
        name: userObject.name
    };
    const token = jwt.sign(payload, secret);
    return token;
}


async function crackTheJWTToken(token) {
    const payload = await jwt.verify(token, secret)
    return payload
}

module.exports = { crackTheJWTToken, createJWTToken }