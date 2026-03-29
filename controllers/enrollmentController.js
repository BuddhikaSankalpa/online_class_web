import Enrollment from "../models/enrollment.js"
import Course from "../models/course.js"

// ENROLL COURSE (BUY COURSE)
export async function enrollCourse(req,res){

    try{

        // User must be logged in
        if(req.user == null){
            res.status(401).json({message : "Login required"})
            return
        }

        const userId = req.user.email
        const courseId = req.body.courseId

        // Check whether the course exists
        const course = await Course.findOne({courseId : courseId})

        if(course == null){
            res.status(404).json({message : "Course not found"})
            return
        }

        // Check whether the user already enrolled
        const alreadyEnrolled = await Enrollment.findOne({userId : userId , courseId : courseId})

        if(alreadyEnrolled != null){
            res.status(400).json({message : "You already enrolled this course"})
            return
        }

        const newEnrollment = new Enrollment({
            userId : userId,
            courseId : courseId
        })

        await newEnrollment.save()

        res.json({message : "Course enrolled successfully"})

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// GET MY COURSES
export async function getMyCourses(req,res){

    try{

        if(req.user == null){
            res.status(401).json({message : "Login required"})
            return
        }

        const userId = req.user.email

        const enrollments = await Enrollment.find({userId : userId})

        res.json(enrollments)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// CHECK USER ENROLLED OR NOT
export async function checkEnrollment(req,res){

    try{

        if(req.user == null){
            res.status(401).json({message : "Login required"})
            return
        }

        const userId = req.user.email
        const courseId = req.params.courseId

        const enrollment = await Enrollment.findOne({userId : userId , courseId : courseId})

        if(enrollment == null){
            res.json({enrolled : false})
        }else{
            res.json({enrolled : true})
        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// GET USERS ENROLLED IN A COURSE (Admin only)
export async function getUsersByCourse(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const courseId = req.params.courseId

            const enrollments = await Enrollment.find({courseId : courseId})

            res.json(enrollments)

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can view enrolled users"})
        return
    }

}




// GET ALL ENROLLMENTS (Admin only)
export async function getAllEnrollments(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const enrollments = await Enrollment.find()

            res.json(enrollments)

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can view enrollments"})
        return
    }

}




// DELETE ENROLLMENT (Admin only)
export async function deleteEnrollment(req,res){

    if(req.user != null && req.user.isAdmin){

        try{

            const enrollment = await Enrollment.findById(req.params.id)

            if(enrollment == null){
                res.status(404).json({message : "Enrollment not found"})
                return
            }

            await Enrollment.deleteOne({_id : req.params.id})

            res.json({message : "Enrollment deleted successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can delete enrollments"})
        return
    }

}