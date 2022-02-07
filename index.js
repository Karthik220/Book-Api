const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//Database
const Database = require("./database");

mongoose.connect(
process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }   
).then(()=>{console.log("Connection established!")}).catch((err)=>{console.log(err)});

//initialization 
const Ourapp = express();

//to convert to json format
Ourapp.use(express.json());


Ourapp.get("/", (request,response)=> {
    response.json({message: "Serving is working"});
});

//BOOKS
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
    //Destructuring implementation 
    const {newBook} = req.body;

    Database.Book.push(newBook);
    return res.json(Database.Book);
});

//6
//Route  -/book/updateTitle/:isbn
//Access -Public
//Method -PUT
//Params -isbn
//Des    -To update the title of the book
Ourapp.put("/book/updateTitle/:isbn", (req,res)=>{
    const {BookTitle} = req.body;
    const {isbn} = req.params;

    Database.Book.forEach((book) => {
        if(book.ISBN === isbn){
            book.title = BookTitle.title;
            // returns updated value of Database.Book
            return book ;
        }
        // returns book if the condition is not true 
        return book;
    })
    return res.json(Database.Book);
})

//7
//Route  -/book/updateAuthor/:isbn
//Access -Public
//Method -PUT
//Params -isbn
//Des    -To update/add the new author in book section
//Once you add author to Database.Book in authors section, similarly in Database.Author
//ISBN of the book must be added in books array  
Ourapp.put("/book/updateAuthor/:isbn", (req,res) => {
    // author id 
    const {updatedauthor} = req.body;
    const {isbn} = req.params;

    //updating authors=[] in Book section 
     Database.Book.forEach((book) =>{
        if(book.ISBN === isbn){
            // check if author already exists 
            if(!book.authors.includes(updatedauthor)){
                 book.authors.push(updatedauthor)
                 // returns if author id not included in the array 
                 return book;
            }
            //returns if isbn equal but author id present in the array
            return book
        }
        //returns if isbn id does not match 
        return book;
    })
    
    //updating books=[] in Author section
    //wont work if id is not present in Author array
     Database.Author.forEach((author) =>{
        if(author.id === updatedauthor){
            if(!author.books.includes(isbn)){
                 author.books.push(isbn)
                 return author;
            }
            return author
        }
          return author
    })
    return res.json({book: Database.Book , author: Database.Author});
})

//8
//Route --/book/delete/:isbn
//Access -Public
//Method -DELETE
//Params -isbn
//Des    -To delete the book based on isbn
Ourapp.delete("/book/delete/:isbn", (req,res) =>{
    const { isbn } = req.params;
    //in filters on an array, directly accepts the condition 
    //if true it will store in a variable
    //if false does not store in a variable
    const filterBooks = Database.Book.filter((book) => book.ISBN !== isbn)

    Database.Book = filterBooks

    return res.json(Database.Book);
});
 
//9  
//Route --/book/delete/author/:isbn/:id
//Access -Public
//Method -DELETE
//Params -isbn , id
//Des    -To delete the the author from book
Ourapp.delete("/book/delete/author/:isbn/:id", (req,res) =>{
    const { isbn , id} = req.params;

    Database.Book.forEach((book) =>{
        if(book.ISBN === isbn){
            if(!book.authors.includes(parseInt(id))){
                return book;
            }
            book.authors = book.authors.filter((databaseID)=> databaseID !== parseInt(id))
            return book;
        }
        return book;
    })
    Database.Author.forEach((author) =>{
        if(author.id === parseInt(id)){
            if(!author.books.includes(isbn)){
                return author;
            }
            author.books = author.books.filter((book)=> book !== isbn)
            return author
        }
        return author
    })
    return res.json({ book:Database.Book , author: Database.Author})
})

//AUTHOR
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
    Database.Author.push(newauthor)
    return res.json(Database.Author)
})

//4
//Route  -/author/updateName/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -To update the details of the author
Ourapp.put("/author/updateName/:id", (req,res) => {
    const {updateAuthorname} = req.body;
    // params in the req body are always in string format
    const {id} = req.params;

     Database.Author.forEach((authorname) =>{
        if(authorname.id === parseInt(id)){
            //not an array hence no push nor pop option 
            //if you do like this you need to do object nested 
            //object inside another object
            authorname.name = updateAuthorname.name;
            return authorname;
        }
    return authorname
    })
   return res.json(Database.Author)
})

//5  ---- MONGO DataBase 

//6  ---- Delete option
//Route  -/author/delete/:id
//Access -Public
//Method -DELETE
//Params -id
//Des   -To delete the author
Ourapp.delete("/author/delete/:id", (req,res) =>{
    const {id} = req.params;

    const filterAuthors = Database.Author.filter((authorID) => authorID.id !== parseInt(id))
    Database.Author = filterAuthors;

    return res.json(Database.Author)
})


//Publication
//1
//Route  -/publication
//Access -Public
//Method -GET
//Params -None
//Des    -to get all Publications
Ourapp.get("/publication", (req,res) => {
    return res.json({publications: Database.Publication});
});

//2
//Route  -/publication/:pubID
//Access -Public
//Method -GET
//Params -pubID
//Des    -to get specific publications
Ourapp.get("/publication/:pubID", (req,res)=> {
    const specifiedpub = Database.Publication.filter(
        (pubID) => pubID.id === parseInt(req.params.pubID)
    );
    return res.json({publicationID:specifiedpub})
})

//3
//Route  -/publication/b/:bookname
//Access -Public
//Method -GET
//Params -bookname
//Des   -to get a list of publication based on book
Ourapp.get("/publication/b/:bookname", (req,res) => {
    const listpub = Database.Publication.filter(
        (bookname) => bookname.books.includes(req.params.bookname)
    );
    return res.json({publicationbook:listpub});
})

//4
//Route  -/publication/new
//Access -Public
//Method -POST
//Params -none
//Des   -To add new publication
Ourapp.post("/publication/new", (req,res) => {
    //sending one object, no braces {}
    const {newpublication} = req.body;
   Database.Publication.push(newpublication)
    return res.json(Database.Publication);
})

//5 ---- update publication
//Route  -/publication/updatename/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -To update publication
Ourapp.put("/publication/updatename/:id", (req,res)=>{
    const {id} = req.params;
    const {publicationname} = req.body;

    //Updating books in publication section
    Database.Publication.forEach((pubname) =>{
        if(pubname.id === parseInt(id)){
            pubname.name = publicationname.name;
            return pubname;
        }
        return pubname;
    })

    return res.json(Database.Publication);
})


//6 ---- to update/add new book
//Route  -/publication/updatebooks/:id/:isbn
//Access -Public
//Method -PUT
//Params -id , isbn
//Des   -To update/add new book


//7 ---- delete a book from publication
//Route  -/pulication/delete/book/:id/:isbn
//Access -Public
//Method -DELETE
//Params -id , isbn
//Des   -To delete books from publication
Ourapp.delete("/pulication/delete/book/:id/:isbn", (req,res)=>{
    const { id , isbn } = req.params;

    Database.Book.forEach((book)=>{
        if(book.ISBN === isbn)
        {
            book.publication = 0;
            return book;
        }
        return book;
    })

    Database.Publication.forEach((publication)=>{
        if(publication.id === parseInt(id)){
            const filterBooks = publication.books.filter((book) => book !== isbn)
            publication.books = filterBooks;
            return publication;
        }
        return publication;
    })
    return res.json({book:Database.Book , publication:Database.Publication});
})


//8 ---- delete a publication
//Route  -/pulication/delete/:id
//Access -Public
//Method -DELETE
//Params -id
//Des   -To delete a publication
Ourapp.delete("/publication/delete/:id",(req,res)=>{
    const { id } = req.params;

    const filterPub = Database.Publication.filter((pub)=>pub.id !== parseInt(id))

    Database.Publication = filterPub;

    return res.json(Database.Publication);

})

Ourapp.listen(4000, ()=>{console.log("Server is running")});
