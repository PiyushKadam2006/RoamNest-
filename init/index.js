///we have created it for the connectioin of initial data and the data base with the routes 
// require => mongoose, data.js , Listing, 
//create mongourl 
 // ,make connection with main and function 

 const mongoose = require("mongoose");
 const intiData = require(".data.js");
 const Listing = require("../models/listing");

 const MONGO_URL = "mongodb://localhost:27017/wanderlust";

 main() 
 .then(()=>{
    console.log("connect to mongo SUCCESSFULLY");
 })
 .catch((err)=>{
    console.log("ERROR OCCURED DUE TO DATABASE ")
 })

async function main(){
    await mongoose.connect(MONGO_URL);
}

const intiData =async ()=>{
   await Listing.deleteMany({});
   await Listing.insertMany({});
   console.log("data initialised success");
}

intiData();