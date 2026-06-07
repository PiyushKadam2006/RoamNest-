const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Reviewing = require("../models/review");
/* const Review = require("../models/review"); */
const { isLoggedIn ,isOwner,validateListing,validateReview} = require("../middleware.js")
/* server side validation middleware for review */



/* reviews routes */
router.post("/",isLoggedIn,
    validateReview, 
    wrapAsync(async (req, res) => {
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
}))
/* delete for reviews */
router.delete("/:review_id", wrapAsync(async (req, res) => {
    const { id ,review_id} = req.params;
    // const idDelete = await Review.findByIdAndDelete(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : review_id}})
    await Reviewing.findByIdAndDelete(review_id)
    // console.log(idDelete);
    req.flash("success"," Review deleted !!!");    
    res.redirect(`/listings/${id}`);

}));


module.exports = router;