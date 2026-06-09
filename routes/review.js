const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Reviewing = require("../models/review");
/* const Review = require("../models/review"); */
const { isLoggedIn ,isOwner,validateListing,validateReview,isReviewAuthor} = require("../middleware.js")
/* server side validation middleware for review */

/* review controller */
const reviewController = require("../controllers/reviews.js");


/* reviews routes */
router.post("/",isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview))
/* delete for reviews */
router.delete("/:review_id",
    isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.destroyReview));


module.exports = router;