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
const {Student,Room,Staff,Complaint,Fee,Log,Announcement,Seq}=require("./model/schemamodel");


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




 
// Student.createCollection();
// Room.createCollection();
// Fee.createCollection();
// Complaint.createCollection();
 //Log.createCollection();
// Staff.createCollection();
// Announcement.createCollection();
// Seq.createCollection();

// Room.insertMany
// ([
// 	{
// 		room_id:0101,
// 		srno1:0,
// 		srno2:0,
// 		srno3:0,
// 		filled:false
//     },
// 	{
// 		room_id:0102,
// 		srno1:0,
// 		srno2:0,
// 		srno3:0,
// 		filled:false
// 	},
// 	{
// 		room_id:0103,
// 		srno1:0,
// 		srno2:0,
// 		srno3:0,
// 		filled:false
// 	},
// 	{
// 		room_id:0104,
// 		srno1:0,
// 		srno2:0,
// 		srno3:0,
// 		filled:false
// 	}
// ]);

// Seq.insertMany([
// 	{
// 		seq:0
// 	}
// ])
// bcrypt.hash("qwert", saltRounds, async function(err, hash){
// await Staff.insertMany([
// 	{
// 		id:100,
// 		name:"puneeth",
// 		position:"mess management",
// 		mobile_num:9449762654,
// 		password:hash
		
// 	}
// ])
// })

// Uploading image to database
var multer = require('multer');
const { query } = require("express");
const { use } = require("passport");
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

//Home page
app.get("/",(req,res)=>
{
	res.render("Homepage/Home");
})

//fee payment
app.get("/payfee",async(req,res)=>
{
	//console.log(req.session.username);
	if(req.session.loggedin)
	{
		res.render("Feepage/Fee");
	}
	else{
		res.redirect("/studentlogin");
	}

})

//complaint
app.get("/complaint",(req,res)=>
{
		if(req.session.loggedin)
	   { res.render("Complaint/complaint");}
	   else{
		res.redirect("/studentlogin");
	   }
})

//announcemnt
app.get("/announcement", async(req,res)=>
{
	let announcements= await Announcement.find({});
	if(req.session.loggedin)
	{ res.render("Announcement/announcement",{announcements});}
	else{
	 res.redirect("/studentlogin");
	}
})

//logbook
app.get("/logbook",(req,res)=>
{
	if(req.session.loggedin)
	{ res.render("Logbook/Logbook");}
	else{
	 res.redirect("/studentlogin");
	}
});

//student login
app.get("/studentlogin",(req,res)=>
{
	let valid=true;
	valid=req.query.valid;
	res.render("loginpage/Login",{valid});
});

//staff details
app.get("/staffdetails",(req,res)=>
{
	if(req.session.loggedin)
	{res.render("Staffdetails/stafdetails");}
	else{
		res.redirect("/studentlogin");
	}
});


//Staff login
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


//complaint list
app.get("/complaintlist",async(req,res)=>
{
	let complaints= await Complaint.find({});
	res.render("Admin/complainttable",{complaints});
})

//entry details
app.get("/entrydetails",async(req,res)=>
{
	let logs= await Log.find({});
	res.render("Admin/logbooktable",{logs});
})

//make announcement
app.get("/makeannouncement",(req,res)=>
{
	res.render("Admin/makeanmnt");
})


//Room allotment Process 

app.get("/roomallotment",async(req,res)=>
{
	await Room.updateMany({},{filled:false,srno1:0,srno2:0,srno3:0});

	let studentlist=await Fee.find({});
	//sort the array based on order 
	studentlist.sort((a,b)=>
	{
		return a.order-b.order
	})
	

	for (let student of studentlist) 
	{
		console.log("hello");
		let rmate1=student.roommate1;
		let rmate2=student.roommate2;
		console.log(rmate1);
		await Fee.deleteOne({srno:rmate1});
		await Fee.deleteOne({srno:rmate2});
		studentlist = studentlist.filter((student) => student.srno !== rmate1 && student.srno !== rmate2);
	}

	let studentlist1=await Fee.find({});
	console.log(studentlist1);
	studentlist1.sort((a,b)=>
	{
		return a.order-b.order
	})

	for (let student of studentlist1)
	{
		console.log("inside main loop");
		let room1= await Room.findOne({room_id:student.pref1});
		let room2= await Room.findOne({room_id:student.pref2});
		let room3= await Room.findOne({room_id:student.pref3});
		
		let rooms=[room1,room2,room3];
		console.log(rooms);
		for (let room of rooms) {
			console.log("inside sub loop");
			if(room&&room.filled==false)
		{
			console.log("inside if ");
			if(room.srno1!=0)
			{
				if(room.srno2!=0)
				{
					await Student.updateOne({srno:student.srno},{room_id:room.room_id});
					await Room.updateOne({room_id:room.room_id},{srno3:student.srno,filled:true});
				}
				else
				{
					await Student.updateOne({srno:student.srno},{room_id:room.room_id});
					await Room.updateOne({room_id:room.room_id},{srno2:student.srno});
				}
			}
			else
			{
				console.log("happening");
				await Student.updateOne({srno:student.srno},{room_id:room.room_id});
				await Student.updateOne({srno:student.roommate1},{room_id:room.room_id});
				await Student.updateOne({srno:student.roommate2},{room_id:room.room_id});
				await Room.updateOne({room_id:room.room_id},{srno1:student.srno,srno2:student.roommate1,srno3:student.roommate2,filled:true});
				break;
			}
		}
		}
		
		
	}
	//await Fee.deleteMany({});
	res.redirect("/");

});

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

//Make announcement
app.post("/makeannouncement",async(req,res)=>
{
	await Announcement.insertMany([
		{
			title:req.body.title,
			content:req.body.text
		}
	])
	res.redirect("/");
})

//Fee payment
app.post("/payfee",async(req,res)=>
{
	let currdate = new Date().toLocaleDateString();
	let id="63bc5bfd6de48cf6ebfa1940"
	let sequence=await Seq.findById(id);
	let sq=sequence.seq;
	await Fee.insertMany([{
		srno:req.body.srno,
		date:currdate,
		order:sq,
		pref1:req.body.prf1,
		pref2:req.body.prf2,
		pref3:req.body.prf3,
		roommate1:req.body.rm1,
		roommate2:req.body.rm2
      }])
	  sq++;
	  await Seq.findByIdAndUpdate(id,{seq:sq});
	  res.redirect('https://pmny.in/lIBl9DRN9k5o');
})

//Complaint request
app.post("/complaint",async(req,res)=>
{
	if(req.body.srno==req.session.username){
	let user=await Student.findOne({srno:req.session.username});
	{await Complaint.insertMany([
		{
			
			srno:req.body.srno,
			name:user.firstname,
			phonenumber:user.mobilenum,
			room_id:user.room_id,
			item:req.body.item,
			complaint_desc:req.body.complaint
		}
	])}
}
	else
	{
		console.log("invalid user");
	}
	
	res.redirect("/");
})

//Register
app.post("/register",upload.single("profileimage"),(req,res)=>
{

	bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
		 await Student.insertMany([
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
				room_id:0,
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
		const ismatch= await bcrypt.compare(req.body.password,user.password);
		if(!ismatch)
		{
			let valid=encodeURIComponent("false");
			res.redirect("/stafflogin?valid="+valid);
		}
		else
		{
			// console.log(user);
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
		let user= await Student.findOne({srno:req.session.username});
		await Log.insertMany([
			{
				srno:req.body.srno,
				date:req.body.date,
				name:user.firstname,
				phonenumber:user.mobilenum,
			}
		])
	}
	catch(err)
	{
		console.log(err);
	}
	res.redirect("/");
})

app.listen(3000,()=>
{
	console.log("Server is up and running");
})