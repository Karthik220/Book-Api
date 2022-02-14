// Router meaning /book will come here 
const Router = require("express").Router();

const Book = require("../schemas/bookdb");
const Author = require("../schemas/authordb");


//1
// Route  -/book
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all books
//async function because the find function may take time, hence code will run but
//return statement will happen, hence async function is given so that all the records 
//will be returned 
Router.get("/", async (req,res)=> {
    const getAllBooks = await Book.find()
    return res.json(getAllBooks);
});

//2
// Route  -/book/:bookID
// Access -Public
//Method  -GET
//Params  -bookID
//Body    -none
//Des     -to get a book based on ISBN
Router.get("/:bookID", async(req,res) => {
    //findOne is for one id, ie not an array 
        const getSpecifiedBook = await Book.findOne({ISBN: req.params.bookID})
    
        //Template string because to return that value to the user
        if(!getSpecifiedBook){
            return res.json({
                error:`No book found for the ISBN of ${req.params.bookID}`
            })
        }
            //Object, curcly bracket 
         return res.json({book:getSpecifiedBook});
})

//3
// Route  -/book/c/:category
// Access -Public
//Method  -GET
//Params  -category
//Body    -none
//Des     -to get a list of books based on category
//includes to search within the array of category
Router.get("/c/:category",async(req,res) => {
    const getSpeciBookCategory = await Book.find({category: req.params.category}) 

    if(!getSpeciBookCategory){
        return res.json({error:`No book found for the category of ${req.params.category}`})
    }
    return res.json({books: getSpeciBookCategory})
})

//4
// Route  -/book/a/:authorID
//Access -Public
//Method  -GET
//Params  -authorID
//Body    -none
//Des     -to get a list of books based on author
Router.get("/a/:authorID", async(req,res) => {
    const { authorID } = req.params;
    const getSpecifiedBookAuthor = await Book.find(
        {
            authors: parseInt(authorID)
        }
    )

    if(!getSpecifiedBookAuthor){
        return res.json({error: `No book found for the authorID of ${ authorID }`})
    }
    return res.json({books: getSpecifiedBookAuthor})
})

//5
//Route  -/book/new
//Access -Public
//Method -POST
//Params -none
//Body   -
//Des   -To add new book
Router.post("/new", async (req,res) =>{
    try{
        const {newBook} = req.body;
 
        await Book.create(newBook);
 
        return res.json({message:"Book Added to the database"})
    }catch(error){
        return res.json({error:error.message})
    }
 });

//6
//Route  -/book/updateTitle/:isbn
//Access -Public
//Method -PUT
//Params -isbn
//Des    -To update the title of the book
Router.put("/updateTitle/:isbn",async (req,res)=>{
    const {updateBook} = req.body
    const updateBookTitle = await Book.findOneAndUpdate(
        {
             ISBN: req.params.isbn
        },
        {
            //if .title not used then you can make it as title = updateBook
            title: updateBook.title
        },
        {
            new:true
        }
    )
    if(!updateBookTitle){
      return res.json({error: `Title for ${req.params.isbn} cannot be updated as it is not present in Database`})
    }
    return res.json({book: updateBookTitle});
})

//7 
//Route  -/book/updateAuthor/:isbn
//Access -Public
//Method -PUT
//Params -isbn
//Des    -To update/add the new author in book section
//Once you add author to Database.Book in authors section, similarly in Database.Author
//ISBN of the book must be added in books array  
Router.put("/updateAuthor/:isbn", async (req,res) => {
    // author id 
    const {updatedauthorID} = req.body;
    const {isbn} = req.params;

    const updateBookauthor = await Book.findOneAndUpdate(
        {
            //Checking isbn if equal 
            ISBN: isbn
        },

        {
            //adds author id to authors provided they are unique
            $addToSet:{
                        authors:updatedauthorID   
            } 
        },

        {
            //new is a property 
            new: true
        }
    )
    
    const updateAuthorBook = await Author.findOneAndUpdate(
        {
            //checks the id of author
            id:updatedauthorID
        },
        {
            //adds isbn to books if it is unique
            $addToSet:{
                books:isbn
            }
        },
        {
            new:true
        }
    )

    return res.json({ 
        books:updateBookauthor , 
        author:updateAuthorBook,
        message:"New Author was added into Database"
    })
})

//8
//Route --/book/delete/:isbn
//Access -Public
//Method -DELETE
//Params -isbn
//Des    -To delete the book based on isbn
Router.delete("/delete/:isbn", async(req,res) =>{
    const { isbn } = req.params;

    const newBookAfterDeletion = await Book.findOneAndDelete({
        ISBN: isbn
    })

    return res.json({message: "Book Deleted"});
});

//9
//Route --/book/delete/author/:isbn/:id
//Access -Public
//Method -DELETE
//Params -isbn , id
//Des    -To delete the the author from book
Router.delete("/delete/author/:isbn/:id", async(req,res) =>{
    const { isbn , id} = req.params;

   const authorDeleteBook = await Book.findOneAndUpdate(
       {
            ISBN: isbn
        },

        {
            $pull:{
                    authors: parseInt(id)
            }
        },

        {
            new: true
        }    
    )    

    const bookDeleteAuthor = await Author.findOneAndUpdate(
        {
            id: parseInt(id)
        },

        {
            $pull:{
                books: isbn
            }
        },

        {
            new: true
        }
    )

    return res.json({ 
        book:authorDeleteBook , 
        author: bookDeleteAuthor , 
        message: "Author was deleted"
    })
})

module.exports = Router;