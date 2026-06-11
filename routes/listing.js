const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
/*multer */
const multer  = require('multer')
/* for cloudinary this place is imp */ const {storage} =require("../cloudConfig.js");
const upload = multer({ storage })    //our multiparse data will be send to this file

/* controllers  */
const listingController = require("../controllers/listings.js");
/* for server schema validation (JOI) listing */

/* router.route */
router.
    route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );
       
       

/* new route => always make above /:id route otherwise will be considered as id */
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.
    route("/:id")
    .get(wrapAsync(listingController.showLinsting))
    .put(isLoggedIn, 
        isOwner,
        upload.single('listing[image]'),
         validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListings));
//create route  C

//show routes R
//post route for new lisiting creation
//post route connected with the get form and post the form using new ejs file

//Create Route


/* revies post  */


//route for edit  
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
//during update route
router;
/* delete listing and call to mongoosew middleware */


module.exports = router;