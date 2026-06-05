/* module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing !");
       return res.redirect("/login");
    }
    next();
} */

    module.exports.isLoggedIn = (req, res, next) => {
      console.log(req.user);  ///checking is logged in or nor for stylling signup login logout
    if (!req.isAuthenticated()) {
       req.session.redirectUrl = "/listings/new"; 
      //   req.session.redirectUrl = req.originalUrl; // ← saves whatever URL they tried to access
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}

