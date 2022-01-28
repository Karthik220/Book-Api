const Database = require("./database");
const express = require("express");

//initialization 
const Ourapp = express();

Ourapp.get("/", (request,response)=> {
    response.json({message: "Serving is working"});
});


// Route  -/book
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all books
Ourapp.get("/book", (req,res)=> {
    return res.json({books: Database.Book});
});

// Route  -/book/:bookID
// Access -Public
//Method  -GET
//Params  -bookID
//Body    -none
//Des     -to get a book based on ISBN
Ourapp.get("/book/:bookID", (req,res) => {
    const getBook = Database.Book.filter(
        (book) => book.ISBN === req.params.bookID 
        ); 
     return res.json({book:getBook});
})

// Route  -/book/c/:category
// Access -Public
//Method  -GET
//Params  -category
//Body    -none
//Des     -to get a list of books based on category
//includes to search within the array of category
Ourapp.get("/book/c/:category",(req,res) => {
    const getBook = Database.Book.filter(
        (book) => book.category.includes(req.params.category)
    );
    return res.json({book:getBook});
})

// Route  -/author
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all authors
Ourapp.get("/author", (req,res)=> {
    return res.json({authors: Database.Author});
});

Ourapp.listen(4000, ()=>{console.log("Server is running")});
