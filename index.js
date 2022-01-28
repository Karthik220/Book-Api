const Database = require("./database");
const express = require("express");

//initialization 
const Ourapp = express();

Ourapp.get("/", (request,response)=> {
    response.json({message: "Serving is working"});
});

Ourapp.get("/book", (req,res)=> {
    return res.json({books: Database.Book});
});


Ourapp.listen(4000, ()=>{console.log("Server is running")});
