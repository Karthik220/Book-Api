const Router = require("express").Router();

const Author = require("../schemas/authordb");


//1
// Route  -/author
// Access -Public
//Method  -GET
//Params  -none
//Body    -none
//Des     -to get all authors
Router.get("/", async (req,res)=> {
    const getAllAuthors = await Author.find()
    return res.json(getAllAuthors);
});

//2
// Route  -/author/:authorID
// Access -Public
//Method  -GET
//Params  -authorID
//Body    -none
//Des     -to get specific author based on ID
Router.get("/:authodID", async(req,res) =>{

    const getSpecifiedAuthor = await Author.findOne(
        {
            id: parseInt(req.params.authodID)
        }
    )

    if(!getSpecifiedAuthor){
        return res.json({
            error: `No author found for the Author ID of ${req.params.authodID}`
        })
    }

    return res.json({author: getSpecifiedAuthor});
})

//3
// Route  -/author/a/:bookisbn
// Access -Public
//Method  -GET
//Params  -authorID
//Body    -none
//Des     -to get list of author based on a book
Router.get("/a/:bookisbn", async(req,res) =>{

    const getAuthorBasedOnBook = await Author.find(
        {
            books: req.params.bookisbn
        }
    )

    if(!getAuthorBasedOnBook){
        return res.json({
            error:`No author found for the Book Isbn on ${req.params.bookisbn}`
        })
    }

    return res.json({author: getAuthorBasedOnBook})
})

//4
//Route  -/author/new
//Access -Public
//Method -POST
//Params -none
//Des   -To add new author
//Body  -{"newAuthor":{details}}
Router.post("/new", async(req,res)=>{
    try{
        const {newAuthor} = req.body;
 
        await Author.create(newAuthor);
 
        return res.json({message:"Author added to the database"})
    }catch(error){
        return res.json({error:error.message})
    }
})

//5
//Route  -/author/updateName/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -To update the details of the author
//Body  -{"name":{updateAuthorname}}
Router.put("/updateName/:id", async (req,res) => {
    const {updateAuthorname} = req.body;

    const newAuthorData = await Author.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },
        {
            name: updateAuthorname.name
        },
        {
            new: true
        }
    )

    if(!newAuthorData){
        return res.json({error:`Cannot update name for id:${req.params.id} as it is not present`})
    }

    return res.json({ author: newAuthorData })
})

//6
//Route  -/author/update/:id
//Access -Public
//Method -PUT
//Params -id
//Des   -To update the author id
//Body  -None
Router.put("/update/:id", async(req,res)=>{
    const {newAuthorId} = req.body;

    const newDataAuthor = await Author.findOneAndUpdate(
        {
            id: parseInt(req.params.id)
        },

        {
            $set:{
                id: newAuthorId
            }
        },

        {
            new: true
        }
    )
    return res.json({message: "Author id updated"})
})


//7
//Route  -/author/delete/:id
//Access -Public
//Method -DELETE
//Params -id
//Des   -To delete the author
Router.delete("/delete/:id", async(req,res) =>{
    const { id } = req.params;

    const authorDelete = await Author.findOneAndDelete(
        {
            id: parseInt(id)
        }
    )

    return res.json({message: "Author Deleted"})
})

module.exports = Router;