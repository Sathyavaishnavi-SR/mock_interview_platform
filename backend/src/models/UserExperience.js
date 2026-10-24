import mongoose from "mongoose";

const userExperienceSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        required:true,
        trim:true
    },
    interviewType:{
        type:String,
        enum:['Technical','HR/Behavioral','other',"Technical+HR"],
        required:true
    },
    interviewMode:{
        type:String,
        enum:['Hybrid','Online','Offline'],
        required:true
    },
    interviewDate:{
        type:Date,
        required:false
    },
    numberOfRounds:{
        type:String,
        required:true,
        enum:['1-Round','2-Rounds','3-Rounds','4-Rounds','5-Rounds','6-Rounds','6+ Rounds']
    },
    

})