const express = require("express");
const app = express();
const path = require("path")
const session = require("express-session");
const flash = require("connect-flash");


/* app.get("/reqcount", (req, res) => {
   
   if(req.session.count){
    req.session.count++;
   }
   else{
    req.session.count = 1;
   }
   res.send(`you send the request for ${req.session.count}`)
}); */

const sessionOptions= {
    secret: "mysupersecretstring",
     resave: false, 
     saveUninitialized: true ,
}

app.use(session(sessionOptions ));
app.use(flash());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

const localMiddleware = (req,res,next)=>{
     res.locals.succMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
}

app.get("/register",(req,res)=>{
    let {name="ananymous"} = req.query;
    req.session.name= name;
    /* console.log(name); */
    if(name == "ananymous"){
        req.flash("error","user not registerd ");
    }else{

        req.flash("success","user registerd successfully");
    }
    
    // res.send(name)
     res.redirect("/hello")
}) ;
app.get("/hello",localMiddleware,(req,res)=>{
   
    res.render("flash",{name : req.session.name , msg : req.flash("success")})
})

/* app.get("/test",(req,res)=>{
    res.send("test successful!");
}); */
app.listen(3000, () => {
    console.log("connected to server port 3000");
});