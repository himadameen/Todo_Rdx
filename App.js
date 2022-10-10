const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: ".env" });

app.use(bodyParser.json());
app.use(cors());

const userRoute = require('./routes/user');
const todoRoute = require('./routes/todo');


app.use("/new", userRoute);
app.use("/todo_list", todoRoute);


app.get('/', (req, res) => {
    try {
        res.send("tHis is backend !!");
    }
    catch (err) {
        res.status(400).json(err);
    }
})

mongoose.connect(process.env.MONGOURI);

app.listen(process.env.APP_PORT || 4002);