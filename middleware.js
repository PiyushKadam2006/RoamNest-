/* module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing !");
       return res.redirect("/login");
    }
    next();
} */

    module.exports.isLoggedIn = (req, res, next) => {
      console.log(req);
      console.log(req.user);  ///checking is logged in or nor for stylling signup login logout
    if (!req.isAuthenticated()) {
      /* redirectUrl */
      /*  isLoggedIn KO call lagegi tabhi to below wala varible defined hoga */
       req.session.redirectUrl = req.originalUrl; 
      //   req.session.redirectUrl = req.originalUrl; // ← saves whatever URL they tried to access
        req.flash("error", "you must be logged in to create listing !");
        return res.redirect("/login");
    }
    next();
}

/* to make safe from passports auto delete sessions*/
module.exports.saveRedirectUrl =(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

