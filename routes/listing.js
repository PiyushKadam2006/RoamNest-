const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js")

/* for server schema validation (JOI) listing */




/* index route  */
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("listings/index", { allListing })
}));

//create route  C
/* new route */
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);////////////////////////////////////////////////////////////////////////

    res.render("listings/new");
})

//show routes R
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // const listing = await Listing.findById(id);
        const listing = await Listing.findById(id)
            .populate("reviews")
            .populate("owner"); // listings ke andar me owner kar expand karke dega , like looks simple
        if (!listing) {
            /* agar listing exist nahi karti , and deleted lisitng ka libnk past kiya to error new error.ejs pe nahi , lisitng pe error dikhaye  */
            req.flash("error", "Listing you requested for does not exist !");
            return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show", { listing });
    }));
//post route for new lisiting creation
//post route connected with the get form and post the form using new ejs file

//Create Route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        console.log(req.user);//ye owner related data store karata he 
        /* for the error of 'username'*/
        newListing.owner = req.user._id;
        await newListing.save();
        /* flash sessions  */
        req.flash("success", "New Listing add");
        res.redirect("/listings");
    }));

/* revies post  */


//route for edit  
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing })
}));
//during update route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // if (!currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        //     req.flash("error", "You don't have permission to edit")
        //     return res.redirect(`/listings/${id}`);
        //     // throw new ExpressError(400, "Invalid listing data");
        // }
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing eddited successfully !!!");
        res.redirect(`/listings/${id}`);
    }));

/* delete listing and call to mongoosew middleware */
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const idDelete = await Listing.findByIdAndDelete(id);
    console.log(idDelete);
    req.flash("success", "Listing deleted successfully !!!");
    res.redirect("/listings");
}));

module.exports = router;