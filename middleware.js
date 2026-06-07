/* module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing !");
       return res.redirect("/login");
    }
    next();
} */
const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review");
// const Listing = require("../models/listing");

    module.exports.isLoggedIn = (req, res, next) => {
      console.log(req);
      console.log(req.user);  ///checking is logged in or nor for stylling signup login logout
    if (!req.isAuthenticated()) {
      /* redirectUrl */
      /*  isLoggedIn KO call lagegi tabhi to below wala varible defined hoga */
       req.session.redirectUrl = req.originalUrl; 
      //   req.session.redirectUrl = req.originalUrl; // ← saves whatever URL they tried to access
        req.flash("error", "you must be logged in to create listing !");
        return res.redirect("/login");
    }
    next();
}

/* to make safe from passports auto delete sessions*/
module.exports.saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
         let listing = await Listing.findById(id);
         if ( !listing.owner._id.equals(res.locals.currUser._id)){
         req.flash("error","You don't have permission")
         return res.redirect(`/listings/${id}`);
}
next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};

module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id ,review_id } = req.params;
         let review = await Review.findById(review_id);
         if ( !review.author._id.equals(res.locals.currUser._id)){
         req.flash("error","Only author have permission !!!")
         return res.redirect(`/listings/${id}`);
}
next();
}



