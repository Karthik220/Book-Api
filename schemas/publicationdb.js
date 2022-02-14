const mongoose = require("mongoose");

//Schema is a structure, colloection of datas 

//Create a Publication schema 
const PublicationSchema = mongoose.Schema({
       id:{
           type: Number,
           required: true
       },
       name: String,
       books:[String]
});

//Create a Author model 
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;