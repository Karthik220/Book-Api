const Database = require("./database");
const express = require("express");
const parse = require("nodemon/lib/cli/parse");

//initialization 
const Ourapp = express();
//to convert to json format
Ourapp.use(express.json());
Ourapp.get("/", (request,response)=> {
    response.json({message: "Serving is working"});
});

//1
// Route  -/book
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all books
Ourapp.get("/book", (req,res)=> {
    return res.json({books: Database.Book});
});

//2
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

//3
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

//4
// Route  -/book/a/:authorID
//Access -Public
//Method  -GET
//Params  -authorID
//Body    -none
//Des     -to get a list of books based on author
Ourapp.get("/book/a/:authorID",(req,res) => {
    const getBook = Database.Book.filter(
        (authorID) => authorID.authors.includes(parseInt(req.params.authorID))
    );
    return res.json({books:getBook});
})

//5
//Route  -/book/new
//Access -Public
//Method -POST
//Params -none
//Body   -
//Des   -To add new book
Ourapp.post("/book/new", (req,res) =>{
    //directly sending the object 
    console.log(req.body);
    return res.json({message:"Book Added Successfully"});
});

//1
// Route  -/author
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all authors
Ourapp.get("/author", (req,res)=> {
    return res.json({authors: Database.Author});
});

//2
// Route  -/author/:authorID
// Access -Public
//Method  -GET
//Params  -authorID
//Body    -none
//Des     -to get specific author
Ourapp.get("/author/:authodID", (req,res) =>{
    const getspecifiedAuthor = Database.Author.filter(
        (authorID) => authorID.id === parseInt(req.params.authodID)
        ); 
        return res.json({author:getspecifiedAuthor});
})

//3
//Route  -/author/new
//Access -Public
//Method -POST
//Params -none
//Des   -To add new author
Ourapp.post("/author/new", (req,res)=>{
    //Destructuring newauthor, nested object, entered into the object 
    const {newauthor} = req.body
    console.log(newauthor);
    return res.json({message: "author was added"});
})



//Route  -/publication/new
//Access -Public
//Method -POST
//Params -none
//Des   -To add new publication
Ourapp.post("/publication/new", (req,res) => {
    //sending one object, no braces {}
    const newpublication = req.body;
    console.log(newpublication);
    return res.json({message:"publication was added"});
})


Ourapp.listen(4000, ()=>{console.log("Server is running")});
