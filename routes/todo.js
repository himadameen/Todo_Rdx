const express = require('express');
const model = require('../models/Todo');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

router.get('/', requireRegister, async (req, res) => {
    try {
        const response = await model.find({
            todoBy: req.user_data
        })
        res.status(200).json({ message: response });
    }
    catch (err) {
        res.status(400).json(err);
    }
})


router.post('/create', requireRegister, async (req, res) => {
    try {
        const new_list = new model({
            todo: req.body.todo,
            todoBy: req.user_data,
        })
        const response = await new_list.save();
        res.status(201).json({ message: response });
        console.log(response);
    }
    catch (err) {
        console.log(err);
        res.status(404).json(err);
    }
})

router.delete('/remove/:_id', requireRegister, async (req, res) => {
    try {
        const temp = req.params._id;
        const responseTodo = await model.deleteOne({ '_id': temp });
        res.status(200).json({ message: responseTodo });
        console.log("deleted");
    }
    catch (err) {
        res.status(400).json(err);
    }
})


module.exports = router;