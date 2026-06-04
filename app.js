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
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

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

/* routes */
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.get("/", (req, res) => {
    res.send("this is home root");
})



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