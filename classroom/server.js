const express = require("express");
const app = express();


app.get("/user",(req,res)=>{
    res.send("this is user ")
})
app.get("/post",(req,res)=>{
    res.send("this is post ")
})

app.listen(3000, () => {
    console.log("connected to server port 3000");
})