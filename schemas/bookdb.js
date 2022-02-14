const mongoose = require("mongoose");

//Schema is a structure, colloection of datas 

//Create a book schema 
const BookSchema = mongoose.Schema({
        ISBN:{
            //More than one object use {}
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        authors: [Number],
        language: String,
        pubDate: String,
        numOfPage: Number,
        category: [String],
        publication: Number 
});

//Create a book model 
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;