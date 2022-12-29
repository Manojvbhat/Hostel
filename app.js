const express =require("express");
const app=express();
const path=require("path")
const bodyparser= require("body-parser");


app.use(express.static(__dirname+"/public"));
app.set("views",path.join(__dirname+"/views"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));


app.get("/",async(req,res)=>{
	{
		res.render("pages/Home");
	}
})


app.listen(3000,()=>
{
	console.log("Server is up and running");
})