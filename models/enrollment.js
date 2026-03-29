import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(

    {
        userId : {
            type : String,
            required : true
        },

        courseId : {
            type : String,
            required : true
        },

        enrolledDate : {
            type : Date,
            required : true,
            default : Date.now
        },

        paymentStatus : {
            type : String,
            required : true,
            default : "completed"
        }
    }

)

const Enrollment = mongoose.model("enrollment" , enrollmentSchema)

export default Enrollment