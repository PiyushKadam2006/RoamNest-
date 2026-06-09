const User = require("../models/user");



module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUpForm =async (req, res) => {
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
};

module.exports.renderLogIn = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.loginForm = async (req, res) => {  
    req.flash("success", "Welcome back to wanderlust, you are logged in!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req,res)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","You are logged out !!!");
      res.redirect("/listings");
    })
  }

