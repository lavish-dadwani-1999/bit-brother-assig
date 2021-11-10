const express = require("express")
const userRoutes = require("./Routes/userRoute")
const dotenv = require("dotenv")
const app = express()
require("./db")
dotenv.config({path:'.env'})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRoutes)


app.get("/",(req,res)=>{
    res.send("hello world")
})

app.listen(3000,()=> console.log("server start") )