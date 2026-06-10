const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
   image: {
       url: String,
       filename: String,
}, 
    price: Number,
    location: String,
    country: String,

    reviews : [
       {
        type : Schema.Types.ObjectId,
         ref : "Review"      
       }
    ],
    /* for listing owner */
    owner :{
      type : Schema.Types.ObjectId,
       ref: "User", 
    },
});

/*  mongo middle */
ListingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
                                   /*like loop */
    }
});
//never make both the inputs strings 
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;