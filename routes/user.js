const express = require("express");
const model = require("../models/NewUser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();

const requireRegister = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You must logged In !!" });
    }
    try {
        const { _id } = jwt.verify(authorization, process.env.SECRET_KEY);
        req.user_data = _id
        next();
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ err: "you must be logged in !!" });
    }
}

router.get('/test', requireRegister, (req, res) => {
    try {
        res.json({ message: req.user_data });
    }
    catch (err) {
        console.log(err);
    }
})

router.get("/", async (req, res) => {
    try {
        const response = await model.find();
        res.status(200).json(response);
        console.log("data showed" + response);
    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

router.get('/:_id', async (req, res) => {
    try {
        const temp = req.params._id;
        const response = await model.findOne({ '_id': temp });
        res.status(200).json(response);
        console.log("single data showed" + response);
    }
    catch (err) {
        res.status(400).json(err);
    }
})

// Signup::

router.post('/signup', async (req, res) => {
    try {
        const new_data = new model({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            re_password: req.body.re_password,
        });
        const userExists = await model.findOne({ email: new_data.email });
        if (!new_data.name || !new_data.email || !new_data.password || !new_data.re_password) {
            return res.status(422).json({ error: "Please Fill the data !!" })
        }
        else if (userExists) {
            return res.status(422).json({ error: "Email is already exists !!" });
        } else {
            const response = await new_data.save();
            res.status(200).json({ message: "Successfully sign up !!", status: true, name : req.body.name});
            console.log(response);
        }

    }
    catch (err) {
        res.status(400).json(err);
        console.log(err);
    }
})

// Login ::

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "please add all the fields" });
        }

        const user_data = await model.findOne({ email });

        if (user_data) {
            const match = await bcrypt.compare(password, user_data.password);
            const token = await user_data.generateAuthToken();

            // 2nd method ::

            // const token = await jwt.sign({userId:user_data._id}, JWT_SECRET);
            // res.status(201).json(token);
            // console.log("user_data" , user_data);
            
            if (!match) {
                return res.status(404).json({ error: "Invalid data !!" });
            } else {
                res.status(201).json({ message: token , name : user_data.name})
            }
        } else {
            return res.status(401).json({ error: "Invalid Credentials !!" });
        }

    }
    catch (err) {
        res.status(400).json(err);
    }
})


module.exports = router;