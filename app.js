const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
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
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =require("./models/user.js");
const userRoute = require("./routes/user.js")


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

/* deprication warnin */
mongoose.set('strictQuery', true);

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


/* express sessions  */
const sessionOptions={
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge :  7*24*60*60*1000,
        httpOnly : true,  //cross scripting attacks
    }
}

app.use(session(sessionOptions));
app.use(flash()); //routes ke pehle 
/* defined localMiddleware */

/* configaring strategy for user models */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  //serialize user into sessions 
passport.deserializeUser(User.deserializeUser()); //deserialize user from sessions 
/*  */


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    // console.log( res.locals.success);
    res.locals.error = req.flash("error");
    // console.log( res.locals.error);
    next();
})
/* 
app.get("/demouser", wrapAsync(async (req, res) => {
    let fakeUser = new User({ email: "student@gmail.com", username: "alpha-student" });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})); */


/* routes */
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRoute);


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