import CourseVideo from "../models/coursevideo.js"
import Course from "../models/course.js"




// CREATE COURSE VIDEO
export async function createCourseVideo(req,res){

    // Only admin can upload videos
    if(req.user != null && req.user.isAdmin){

        try{

            const video = await CourseVideo.findOne({videoId : req.body.videoId})

            // Check whether video already exists
            if(video != null){
                res.status(400).json({message : "Video already exists"})
                return
            }

            // Check whether the course exists
            const course = await Course.findOne({courseId : req.body.courseId})

            if(course == null){
                res.status(404).json({message : "Course not found"})
                return
            }

            const newVideo = new CourseVideo(req.body)

            await newVideo.save()

            res.json({message : "Course video created successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can upload videos"})
        return
    }

}




// GET ALL VIDEOS (Admin only)
export async function getAllCourseVideos(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const videos = await CourseVideo.find()
            res.json(videos)

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can view all videos"})
        return
    }

}




// GET VIDEOS BY COURSE ID
export async function getVideosByCourseId(req,res){

    try{

        const videos = await CourseVideo.find({courseId : req.params.courseId}).sort({order : 1})

        res.json(videos)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// GET VIDEO BY VIDEO ID
export async function getVideoById(req,res){

    try{

        const video = await CourseVideo.findOne({videoId : req.params.videoId})

        if(video == null){
            res.status(404).json({message : "Video not found"})
            return
        }

        res.json(video)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// UPDATE VIDEO
export async function updateCourseVideo(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const video = await CourseVideo.findOne({videoId : req.params.videoId})

            if(video == null){
                res.status(404).json({message : "Video not found"})
                return
            }

            // Prevent updating videoId
            if(req.body.videoId != null){
                res.status(400).json({message : "videoId cannot be updated"})
                return
            }

            await CourseVideo.updateOne({videoId : req.params.videoId}, req.body)

            res.json({message : "Video updated successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can update videos"})
        return
    }

}




// DELETE VIDEO
export async function deleteCourseVideo(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const video = await CourseVideo.findOne({videoId : req.params.videoId})

            if(video == null){
                res.status(404).json({message : "Video not found"})
                return
            }

            await CourseVideo.deleteOne({videoId : req.params.videoId})

            res.json({message : "Video deleted successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can delete videos"})
        return
    }

}