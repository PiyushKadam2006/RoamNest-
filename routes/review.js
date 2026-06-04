const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review");






/* server side validation middleware for review */
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};

/* reviews routes */

router.post("/",validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = await Reviewing(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    console.log("review is saved ");
    /* res.send("review is saved "); */

    res.redirect(`/listings/${listing._id}`);
}))
/* delete for reviews */
router.delete("/:review_id", wrapAsync(async (req, res) => {
    const { id ,review_id} = req.params;
    // const idDelete = await Review.findByIdAndDelete(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : review_id}})
    await Review.findByIdAndDelete(review_id)
    // console.log(idDelete);
    res.redirect(`/listings/${id}`);

}));


module.exports = router;