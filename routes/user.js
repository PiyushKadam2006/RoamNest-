const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

/* controller framework */
const userController = require("../controllers/users.js");


/* router.route */
router.
  route("/signup")
  .get( userController.renderSignup)
  .post( wrapAsync(userController.signUpForm));


router.
  route("/login")
  .get(userController.renderLogIn)
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

  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }), userController.loginForm
  );

/* logged out  */
router.get("/logout", userController.userLogout)

module.exports = router;