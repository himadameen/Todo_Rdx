const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    re_password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
})

// hashing the password : 

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.re_password = await bcrypt.hash(this.re_password, 12);
    }
    next();
})

// generating token : :

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

// login validation : :

// const requireRegister = (req,res,next) => {
//     const {authorization} = req.headers
//     if(!authorization){
//         // console.log(err)
//         return res.status(401).json({error : "You must logged In !!"});
//     }
//     try{
//         const {user_id} = jwt.verify(authorization, process.env.SECRET_KEY);
//         req.userExists = user_id
//         next();
//     }
//     catch(err){
//         console.log(err)
//         return res.status(400).json({err : "you must be logged in !!"});
//     }
// }


module.exports = mongoose.model('NewUser', userSchema);