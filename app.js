const express =require("express");
const path=require("path")
const bodyparser= require("body-parser");
const mongoose=require("mongoose");
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const session= require("express-session");
const passport= require("passport");
const cookieparser=require("cookie-parser"); 
// const morgan= require("morgan");
// const passportlocalmongoose= require("passport-local-mongoose");

const app=express();

//Importing schema models 
const {Student,Room,Staff,Complaint,Fee,Log,Announcement}=require("./model/schemamodel");


app.use(express.static(__dirname+"/public"));
//app.use(express.static(__dirname+"/uploads"));
app.set("views",path.join(__dirname+"/views"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieparser());


app.use(session({
	key:'user_id',
	secret:"my secret",
	resave:false,
	saveUninitialized:false,
	cookie:
	{maxAge:7200000}
	
}));

app.use(passport.initialize());
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





 //Student.createCollection();
// Room.createCollection();
// Fee.createCollection();
// Complaint.createCollection();
// Log.createCollection();
// Staff.createCollection();
// Announcement.createCollection();

// Uploading image to database
var multer = require('multer');
const { query } = require("express");
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'upload')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
});

var upload = multer({ storage: storage });

//Get requests 
app.get("/",(req,res)=>
{
	res.render("Homepage/Home");
})

app.get("/payfee",async(req,res)=>
{
	console.log(req.session.username);
	if(req.session.loggedin)
	{res.render("Feepage/Fee");}
	else{
		res.redirect("/studentlogin");
	}

})

app.get("/complaint",(req,res)=>
{
		if(req.session.loggedin)
	   { res.render("Complaint/complaint");}
	   else{
		res.redirect("/studentlogin");
	   }
})

app.get("/announcement",(req,res)=>
{
	if(req.session.loggedin)
	{ res.render("Announcement/announcement");}
	else{
	 res.redirect("/studentlogin");
	}
})

app.get("/logbook",(req,res)=>
{
	if(req.session.loggedin)
	{ res.render("Logbook/Logbook");}
	else{
	 res.redirect("/studentlogin");
	}
});

app.get("/studentlogin",(req,res)=>
{
	let valid=true;
	valid=req.query.valid;
	res.render("loginpage/Login",{valid});
});

app.get("/staff",(req,res)=>
{
	if(req.session.loggedin)
	{res.render("Staffdetails/Staff");}
	else{
		res.redirect("/studentlogin");
	}
});



app.get("/stafflogin",(req,res)=>
{
	let valid=true;
	valid=req.query.valid;
	    res.render("loginpage/Stafflogin",{valid});
});

//Register
app.get("/register",(req,res)=>
{
	res.render("Register/Register");
})

//logout function
app.get("/logout",(req,res)=>
{
	req.session.destroy(function(err){
        if(!err){
          console.log('Destroyed session');
        }else{
          console.log(err);
        }
        res.redirect('/');
      })
})

//Admin
app.get("/admin",(req,res)=>
{
	if(req.session.loggedin && req.session.type=="staff")
	{ res.render("Admin/admin");}
	else{
	 res.redirect("/stafflogin");
	}
})

//Profile Page
app.get("/profile",async(req,res)=>
{
	

	if(req.session.loggedin)
	{ 
		let user=req.session.username;
	let std= await Student.findOne({srno:user});
		res.render("Profile/studentprofile",{std});
	}
	else{
	 res.redirect("/studentlogin");
	}
})
//Post requests

//Complaint request
app.post("/complaint",async(req,res)=>
{
	if(req.body.srno==session.username)
	{await Complaint.insertMany([
		{
			
			srno:req.body.srno,
			complaintid:req.body.srno,
			item:req.body.item,
			complaint_desc:req.body.complaint
		}
	])}
	else
	{
		console.log("invalid user");
	}
	
	res.redirect("/");
})

//Register
app.post("/register",upload.single("profileimage"),(req,res)=>
{

	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		 Student.insertMany([
			{
				srno:req.body.srno,
				usn:req.body.usn,
				firstname:req.body.firstname,
				lastname:req.body.lastname,
				email:req.body.email,
				mobilenum:req.body.mobilenum,
				dob:req.body.dob,
				course:req.body.course,
				branch:req.body.branch,
				sem:req.body.sem,
				state:req.body.state,
				country:req.body.country,
				address:req.body.address,
				father_name:req.body.father_name,
				mother_name:req.body.mother_name,
				parentnum:req.body.parentnum,
				password:hash,
				profileimage: {
					data: fs.readFileSync(path.join(__dirname+"/upload/"+req.file.filename)),
					contentType: req.file.mimetype
				}
			}
		])
	});
	res.redirect("/studentlogin");
});

//Studentlogin
app.post("/studentlogin",async(req,res)=>
{

	// const {srno, password} = req.body
	
 try{
	const user=await Student.findOne({srno:req.body.srno})
	//console.log(user);
	if(!user)
	{
		console.log("invalid user");
	}
	const isMatch=await bcrypt.compare(req.body.password,user.password);

	if(!isMatch) {
		//your code to tell Wrong username or password
		let valid=encodeURIComponent("false")
		res.redirect("/studentlogin?valid="+valid);
		
	} else {
	
		req.session.loggedin = true;
        req.session.username = user.srno;
		req.session.type="student";
		res.redirect("/");
	}
} catch (err) {
	console.log(err)
}})

//Staff login
app.post("/stafflogin",async(req,res)=>
{
	
	try{
		const user= await Staff.findOne({id:req.body.id});
		if(!user)
		{
			console.log("No user found");
			res.redirect("/stafflogin");
		}
		const isMatch=bcrypt.compare(req.body.password,user.password);
		if(!isMatch)
		{
			let valid=encodeURIComponent("false");
			res.redirect("/stafflogin?valid="+valid);
		}
		else
		{
			req.session.loggedin=true;
			req.session.username=user.id;
			req.session.type="staff";
			res.redirect("/");
		}
	   }
	   catch(err){
			console.log(err);
	   }
})

//Log book 
app.post("/logbook",async (req,res)=>
{
	try
	{
		await Log.insertMany([
			{
				srno:req.body.srno,
				date:req.body.date
			}
		])
	}
	catch(err)
	{
		console.log(err);
	}
	res.redirect("/logbook");
})

app.listen(3000,()=>
{
	console.log("Server is up and running");
})