const express =require("express");
const app=express();
const path=require("path")
const bodyparser= require("body-parser");
const mongoose=require("mongoose");
require('dotenv').config();

//Importing schema models 
const Student=require("./model/schemamodel");
const Room=require("./model/schemamodel");
const Staff=require("./model/schemamodel");
const Fee=require("./model/schemamodel");
const Complaint=require("./model/schemamodel");
const Log=require("./model/schemamodel");
const Announcement=require("./model/schemamodel");


app.use(express.static(__dirname+"/public"));
app.set("views",path.join(__dirname+"/views"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));

const url="mongodb+srv://manoj:"+process.env.PASSWORD+"@atlascluster.wadrset.mongodb.net/Hostel"
console.log(url);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>
{
	console.log("Connection successful!");
})
.catch(err=>
	{
		console.log("Error: connection failed")
	})

// Student.createCollection();
// Room.createCollection();
// Fee.createCollection();
// Complaint.createCollection();
// Log.createCollection();
// Staff.createCollection();
// Announcement.createCollection();


app.get("/",(req,res)=>
{
	res.render("Homepage/Home");
})

app.get("/payfee",(req,res)=>
{
	    res.render("Feepage/Fee");
})

app.get("/complaint",(req,res)=>
{
	    res.render("Complaint/complaint");
})

app.get("/announcement",(req,res)=>
{
	    res.render("Announcement/announce");
})

app.get("/logbook",(req,res)=>
{
	    res.render("Logbook/Logbook");
});

app.get("/studentlogin",(req,res)=>
{
	res.render("loginpage/Login");
});

app.get("/staff",(req,res)=>
{
	res.render("Staffdetails/Staff");
});

app.get("/complaint",(req,res)=>
{
	    res.render("Complaint/complaint");
})

app.get("/stafflogin",(req,res)=>
{
	    res.render("loginpage/Stafflogin");
})
app.get("/register",(req,res)=>
{
	res.render("Register/Register");
})


// Uploading image to database
var multer = require('multer');
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
});
var upload = multer({ storage: storage });



app.listen(3000,()=>
{
	console.log("Server is up and running");
})