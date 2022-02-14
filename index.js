const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } 
        //promise block   
).then(()=>{console.log("Connection established!")}).catch((err)=>{console.log(err)});

//initialization 
const Ourapp = express();

//to convert to json format
Ourapp.use(express.json());

//API
const Books = require("./Api/book");
const Authors = require("./Api/author");
const Publications = require("./Api/publication");

//Microservices
Ourapp.use("/book", Books );
Ourapp.use("/author", Authors);
Ourapp.use("/publication", Publications);


Ourapp.get("/", (request,response)=> {
    response.send("Welcome to Book Api");
});


const port = process.env.PORT || 4000;

Ourapp.listen(port, ()=>{console.log("Server is running")});
