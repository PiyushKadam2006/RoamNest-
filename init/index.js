///we have created it for the connectioin of initial data and the data base with the routes 
// require => mongoose, data.js , Listing, 
//create mongourl 
 // ,make connection with main and function 

 const mongoose = require("mongoose");
 const initData = require("./data.js");
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

const initDB =async ()=>{
   await Listing.deleteMany({});
   initData.data =initData.data.map((obj)=>({...obj,
      owner :"6a22a4ba602ea8bd6b2cb73d",
   }));
   await Listing.insertMany(initData.data);
   console.log("data intialised success");
};

initDB();