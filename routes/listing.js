const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const {isLoggedIn} = require("../middleware.js")

/* for server schema validation (JOI) listing */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};



/* index route  */
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("listings/index", { allListing })
}));

//create route  C
/* new route */
router.get("/new",isLoggedIn, (req, res) => {
    console.log(req.user);////////////////////////////////////////////////////////////////////////
   
    res.render("listings/new");
})

//show routes R
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    // const listing = await Listing.findById(id);
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        /* agar listing exist nahi karti , and deleted lisitng ka libnk past kiya to error new error.ejs pe nahi , lisitng pe error dikhaye  */
        req.flash("error","Listing you requested for does not exist !");
       return  res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));
//post route for new lisiting creation
//post route connected with the get form and post the form using new ejs file 
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    /* flash sessions  */
    req.flash("success","New Listing add");    
    res.redirect("/listings");
}));

/* revies post  */


//route for edit during update 
;
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing })
}));

router.put("/:id", isLoggedIn,validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing eddited successfully !!!");    
    res.redirect(`/listings/${id}`);
}));
/* delete listing and call to mongoosew middleware */

router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const idDelete = await Listing.findByIdAndDelete(id);
    console.log(idDelete);
    req.flash("success","Listing deleted successfully !!!");    
    res.redirect("/listings");
}));

module.exports = router;