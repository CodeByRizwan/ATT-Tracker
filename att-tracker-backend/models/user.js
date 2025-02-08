const { Schema, model } = require('mongoose');
const { createHmac,randomBytes } = require("crypto")
const { createJWTToken } = require("../services/auth")

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre("save",function(next){
    const user = this
    if(!user.isModified("password")) return
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex")
    this.salt = salt
    this.password = hashedPassword
    next()
})

userSchema.static("comparePasswordAndReturnToken",async function(name,password){
    const user = await this.findOne({name})
    if(!user) throw new Error("User not found!"); 
    const salt = user.salt
    const plainPasswordHashed = createHmac("sha256",salt).update(password).digest("hex")
    if(!(plainPasswordHashed === user.password)){
        throw new Error("Incorrect password")
    }   
    const token = createJWTToken(user)    
    return token
})

const user = model('User', userSchema);
module.exports = user;