const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./models/review");

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
   image: {
    filename: String,
    url: String,
}, 
    price: Number,
    location: String,
    country: String,

    reviews : [
       {
        type : Schema.Types.ObjectId,
         ref : "Review"      
       }

    ]

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