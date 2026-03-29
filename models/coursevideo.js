import mongoose from "mongoose";

const courseVideoSchema = new mongoose.Schema(

    {

        videoId : {
            type : String,
            unique : true,
            required : true
        },
        
        courseId : {
            type : String,
            required : true
        },

        title : {
            type : String,
            required : true
        },

        videoUrl : {
            type : String,
            required : true
        },

        duration : {
            type : String,
            required : true
        },

        order : {
            type : Number,
            required : true
        },

        isPreview : {
            type : Boolean,
            required : true,
            default : false
        }
    }

)

const CourseVideo = mongoose.model("coursevideo" , courseVideoSchema)

export default CourseVideo