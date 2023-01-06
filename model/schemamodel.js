const mongoose = require("mongoose");

const studentschema=new mongoose.Schema(
	{
		srno:
		{
			type:Number,
			required:true,
			unique:true
		},
		usn:
		{
			type:String,
			required:true,
			unique:true
		},
		firstname:
		{
			type:String,
			required:true
		},
		lastname:
		{
			type:String,
			required:true
		},
		email:
		{
			type:String,
			lowercase:true,
			unique:true

		},
		mobilenum:
		{
			type:Number,
			required:true
		},
		dob:{
			type:Date,
			required:true
		},
		course:
		{
			type:String,
			required:true
		},
		branch:
		{
			type:String,
			required:true
		},
		sem:
		{
			type:Number,
			required:true
		},
		state:
		{
			type:String,
			required:true
		},
		country:
		{
			type:String,
			required:true
		},
		address:
		{
			type:String,
			required:true
		},
		father_name:
		{
			type:String
		},
		mother_name:
		{
			type:String
		},
		parentnum:
		{
			type:Number,
			required:true
		},

		profileimage:
		{
			data:Buffer,
        contentType: String
		},
		password:
		{
			type:String
		}


	}
)
//Room schema
const roomschema=new mongoose.Schema(
{
	block_no:
	{
		type:Number
	},
	room_no:
	{
		type:Number,
		required:true
	},
	room_id:
	{
		type:Number,
		unique:true,
		required:true
	},
	srno1:
	{
		type:Number
	},
	srno2:
	{
		type:Number
	},
	srno3:
	{
		type:Number
	}
})
//Staff schema
const staffschema=new mongoose.Schema({
	id:
	{
		type:Number,
		required:true
	},
	name:
	{
		type:String
	},
	postion:
	{
		type:String
	},
	mobile_num:
	{
		type:Number,
		unique:true
	},
	password:
	{
		type:String
	}

});
//Fee schema
const feeschema=new mongoose.Schema({
	srno:
	{
		type:Number,
		unique:true,
		required:true
	},
	utrnum:
	{
		type:String,
		unique:true,
		required:true
	},
	date:
	{
		type:Date,

	},
	order:
	{
		type:Number
	},
	//preferences
	pref1:
	{
		type:Number
	},
	pref2:
	{
		type:Number
	},
	pref3:
	{
		type:Number
	}

});
//complaint schema
const complaint=new mongoose.Schema(
	{
		srno:
		{
			type:Number,
			required:true
		},
		complaintid:
		{
			type:Number
		},
		item:
		{
			type:String
		},
		complaint_desc:
		{
			type:String
		}

	}
);

//log book schema
const logschema=new mongoose.Schema
(
	{
		srno:
		{
			type:Number
		},
		date:
		{
			type:Date
		}
	}
);
//Announcement schema
const announcement =new mongoose.Schema(
	{
		title:
		{
			type:String
		},
		content:
		{
			type:String
		}
	}
)

//defining mongoose models
const Announcement=mongoose.model("Announcement",announcement);
const Log=mongoose.model("Log",logschema);
const Complaint=mongoose.model("Complaint",complaint);
const Fee=mongoose.model("Fee",feeschema);
const Staff=mongoose.model("Staff",staffschema);
const Room=mongoose.model("Room",roomschema);
const Student =mongoose.model("Student",studentschema);

//exporting model
module.exports=Room;
module.exports=Student;