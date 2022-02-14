//Temporary Database 

//Object 
// You can use double inverted or single inverted commas in js file
//but in json format, you must be careful 
//json format can store multiple datas 
//key will always be a string 
//the values assigned to it can be different as we have seen in mongo db 
let Book = [
    {
        ISBN: "12345ONE",
        title: "Getting started with MERN",
        authors: [1,2],
        language: "en",
        pubDate: "2021-07-07",
        numOfPage: 225,
        category: ["fiction","programming","tech","web dev"],
        publication: 1
    },
    {
        ISBN: "12345Two",
        title: "Getting started with Python",
        authors: [1],
        language: "en",
        pubDate: "2021-07-07",
        numOfPage: 225,
        category: ["fiction","tech","web dev"],
        publication: 2
    }
];

let Author = [
    {
        id:1,
        name: "karthik",
        books: ["12345ONE","12345Two"]
    },
    {
        id:2,
        name: "kaushik",
        books: ["12345ONE"]
    },
    {
        id:3,
        name: "Coder",
        books: []
    }
];

let Publication = [
    {
        id:1,
        name: "Chakra",
        books: ["12345ONE"]
    },
    {
        id:2,
        name: "Vickie Publications",
        books: ["12345Two"]
    }
] ;

//Native Javascript 
module.exports = {Book, Author, Publication};