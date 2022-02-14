const Router = require("express").Router();
const Book = require("../schemas/bookdb");
const Publication = require("../schemas/publicationdb")

//1
//Route  -/publication
//Access -Public
//Method -GET
//Params -None
//Des    -to get all Publications
Router.get("/", async(req,res) => {
    const getAllPublications = await Publication.find()
    return res.json(getAllPublications)
});

//2
//Route  -/publication/:pubID
//Access -Public
//Method -GET
//Params -pubID
//Des    -to get specific publications based on PubID
Router.get("/:pubID", async(req,res)=> {
    const specifiedPublication = await Publication.findOne(
        {
            id: req.params.pubID
        }
    )

    if(!specifiedPublication){
        return res.json({
            error: `No Publication found for the ID of ${req.params.pubID}`
        })
    }
    return res.json({ publication: specifiedPublication })
})

//3
//Route  -/publication/b/:bookname
//Access -Public
//Method -GET
//Params -bookname
//Des   -to get a list of publication based on book
Router.get("/b/:bookname", async (req,res) => {
    const {bookname} = req.params;

    const getSpecifiedPublicationBook = await Publication.findOne(
        {
            books: bookname
        }
    )

    if(!getSpecifiedPublicationBook){
        return res.json({
            error: `No Publication found for the book of ${ bookname }`
        })
    }
    return res.json({ publication: getSpecifiedPublicationBook })    
})

//4
//Route  -/publication/new
//Access -Public
//Method -POST
//Params -none
//Des   -To add new publication
Router.post("/new",async (req,res) => {
    try{
        const { newPublication } = req.body;

        await Publication.create(newPublication)
        return res.json({message:"Publication has been added to the database"})

    }catch(error){
        return res.json({error:error.message})
    }
})

//5 
//Route  -/publication/updatename/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -To update publication
Router.put("/updatename/:id", async(req,res)=>{
    const {publicationName} = req.body;

    const newPublicationData = await Publication.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: publicationName.name
        },
        {
            new: true
        }
    )

    return res.json({publication: newPublicationData})
})

//6
//Route  -/publication/updatebook/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -to update/add new book in Publication 
Router.put("/updatebook/:id", async(req,res) =>{
    const {newBookName} = req.body;

    //Adding new Book to Publication 
    const updatePublicationBook = await Publication.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        
        {
            $addToSet:{
                books: newBookName
            }
        },
        {
            new: true
        }
    )

    const updateBookPublication = await Book.findOneAndUpdate(
        {
            ISBN: newBookName
        },

        {
            publication: req.params.id
        },
        {
            new: true
        }
    )

    return res.json({ 
        publication: updatePublicationBook,
        book: updateBookPublication,
        message:"New Author was added into Database"
    })
})

//7 
//Route  -/pulication/delete/:id
//Access -Public
//Method -DELETE
//Params -id
//Des   -To delete a publication
Router.delete("/delete/:id",async(req,res)=>{

    const newPublicationAfterDeletion = await Publication.findOneAndDelete(
        {
            id: parseInt(req.params.id)
        }
    )
    return res.json({message: "Publication Deleted"});
})


//8
//Route  -/publication/delete/Book/:isbn/:id
//Access -Public
//Method -DELETE
//Params -id , isbn
//Des   -To delete books from publication
Router.delete("/delete/Book/:isbn/:id", async(req,res)=>{
const { isbn , id}=req.params;

    //Deleting books[] from Publication 
    const BooksDeletionInPublication = await Publication.findOneAndUpdate(
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

    const PublicationDeleteInBook = await Book.findOneAndUpdate(
        {
            ISBN: isbn
        },

        {
            publication: 0
        },

        {
            new: true
        }
    )

    return res.json({ 
        publication:BooksDeletionInPublication, 
        book: PublicationDeleteInBook,
        message: "Book was deleted"
    })

})


module.exports = Router