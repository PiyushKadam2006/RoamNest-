const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl} =require("../middleware.js");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    /* auto login using login functionality signup => leads to auto-login  */
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }  
      req.flash("success", "welcome to wanderlust!!");
      return res.redirect("/listings");
    })
  } catch (err) {
    req.flash("error", err.message, err.stack);
    res.redirect("/signup");

  }
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
/* router.post(
  "/login"
  , passport.authenticate("local",
  {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to wnaderlust ,you are logged in !");
    res.redirect("/listings/new");
  }); */

  router.post("/login",
    saveRedirectUrl, 
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), 
async (req, res) => {  
    req.flash("success", "Welcome back to wanderlust, you are logged in!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

/* logged out  */
  router.get("/logout",(req,res)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","You are logged out !!!");
      res.redirect("/listings");
    })
  })

module.exports = router;