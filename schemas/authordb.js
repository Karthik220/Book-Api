const mongoose = require("mongoose");

//Schema is a structure, colloection of datas 

//Create a Author schema 
const AuthorSchema = mongoose.Schema({
       id:{
           type: Number,
           required: true
       },
       name: String,
       books:[String]
});

//Create a Author model 
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;