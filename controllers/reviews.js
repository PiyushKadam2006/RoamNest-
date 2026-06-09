const Listing = require("../models/listing");
const Reviewing = require("../models/review");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Reviewing(req.body.review);
    newReview.author=req.user._id;   //CRUCIAL during review document ke ander user(author) ki ad push karna 
    console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("review is saved ");
    /* res.send("review is saved "); */
     req.flash("success","New Review created !!!");   
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id ,review_id} = req.params;
    // const idDelete = await Review.findByIdAndDelete(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : review_id}})
    await Reviewing.findByIdAndDelete(review_id)
    // console.log(idDelete);
    req.flash("success"," Review deleted !!!");    
    res.redirect(`/listings/${id}`);
}