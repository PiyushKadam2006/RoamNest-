

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");

// ── static middleware (order doesn't depend on DB) ──
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
mongoose.set("strictQuery", true);

const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await mongoose.connect(dbUrl);
        console.log("connected to dataBase");

        // 1. Session store
        const store = MongoStore.create({
            mongoUrl: dbUrl,
            // crypto: { secret: process.env.SECRET },
            touchAfter: 24 * 3600,
        });
        store.on("error", (err) => console.log("SESSION STORE ERROR:", err));

        // 2. Session
        app.use(session({
            store,
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            },
        }));

        // 3. Flash
        app.use(flash());

        // 4. Passport (MUST come after session)
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        // 5. Locals (MUST come after passport)
        app.use((req, res, next) => {
            res.locals.success = req.flash("success");
            res.locals.error = req.flash("error");
            res.locals.currUser = req.user;
            next();
        });

        // 6. Routes (MUST come after locals)
        app.use("/listings", listings);
        app.use("/listings/:id/reviews", reviews);
        app.use("/", userRoute);

        // 7. 404 handler
        app.use((req, res, next) => {
            next(new ExpressError(404, "page not found"));
        });

        // 8. Error handler
        app.use((err, req, res, next) => {
            console.log("ERROR ROUTE:", req.method, req.path);
            if (res.headersSent) return next(err);
            let { statusCode = 500, message = "Something went wrong" } = err;
            res.status(statusCode).render("error", { err });
        });

        // 9. Start listening
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`connected to server port ${PORT}`);
        });

    } catch (err) {
        console.error("DATABASE CONNECTION ERROR:", err);
        process.exit(1);
    }
}

startServer();