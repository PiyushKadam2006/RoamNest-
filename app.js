const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const app = express();
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Reviewing = require("./models/review");
const Review = require("./models/review");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://localhost:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to dataBase");
    })
    .catch((err) => {
        console.log("ERROR DURING CONNECTING WITH DATABASE");
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}
//create  index route 

app.get("/", (req, res) => {
    res.send("this is home root");
})

/* for server schema validation (JOI) listing */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};
/* server side validation middleware for review */
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next()  /* very crucial mistake  */
};

app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("./listings/index", { allListing })
}));

//create route  C
app.get("/listings/new", (req, res) => {
    res.render("./listings/new");
})
//show routes R
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    // const listing = await Listing.findById(id);
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show", { listing });
}));
//post route connected with the get form and post the form using new ejs file 

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

/* revies post  */
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = await Reviewing(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    console.log("review is saved ");
    /* res.send("review is saved "); */

    res.redirect(`/listings/${listing._id}`);
}))

//route for edit during update 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing })
}));
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));
/* delete listing and call to mongoosew middleware */
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const idDelete = await Listing.findByIdAndDelete(id);
    console.log(idDelete);
    res.redirect("/listings");
}));
/* delete for reviews */
app.delete("/listings/:id/reviews/:review_id", wrapAsync(async (req, res) => {
    const { id ,review_id} = req.params;
    // const idDelete = await Review.findByIdAndDelete(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : review_id}})
    await Review.findByIdAndDelete(review_id)
    // console.log(idDelete);
    res.redirect(`/listings/${id}`);

}));

//what is error in this complete file is that if we have any error in any route then it will not be handled and it will show the error in console but we want to handle the error and show the error in the browser so for that we have to use try catch block in every route but it is very hectic so we can use a function which will wrap our async function and catch the error and pass it to next function and then we can handle the error in the error handling middleware? help me 

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { err });
})
app.listen(8080, () => {
    console.log("connected to server port 8080");
})