const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

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

});
//never make both the inputs strings 
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;