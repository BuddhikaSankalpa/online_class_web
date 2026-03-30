import Enrollment from "../models/enrollment.js"
import Course from "../models/course.js"



// ENROLL COURSE (BUY COURSE)
export async function enrollCourse(req,res){

    try{

        // User must be logged in
        if(req.user == null){
            return res.status(401).json({message : "Login required"})
        }

        const userId = req.user.email
        const courseId = req.body.courseId

        // Validate courseId
        if(!courseId){
            return res.status(400).json({message : "Course ID is required"})
        }

        // Check whether the course exists
        const course = await Course.findOne({courseId : courseId})

        if(course == null){
            return res.status(404).json({message : "Course not found"})
        }

        // Check whether the user already enrolled
        const alreadyEnrolled = await Enrollment.findOne({
            userId : userId,
            courseId : courseId
        })

        if(alreadyEnrolled != null){
            return res.status(400).json({message : "You already enrolled this course"})
        }

        // Create new enrollment
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
            return res.status(401).json({message : "Login required"})
        }

        const userId = req.user.email

        // Find enrollments
        const enrollments = await Enrollment.find({userId : userId})

        //user not enrolled in any course
        if(enrollments.length == 0){
            return res.status(404).json({message : "You are not enroll any course"})
        }

        // Get courseIds
        const courseIds = enrollments.map(e => e.courseId)

        // Get courses
        const courses = await Course.find({
            courseId : { $in : courseIds }
        })

        res.json(courses)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}



// CHECK USER ENROLLED OR NOT
export async function checkEnrollment(req,res){

    try{

        if(req.user == null){
            return res.status(401).json({message : "Login required"})
        }

        const userId = req.user.email
        const courseId = req.params.courseId

        //Check whether the course exists
        const course = await Course.findOne({courseId : courseId})

        if(course == null){
            return res.status(404).json({message : "Course not found"})
        }

        const enrollment = await Enrollment.findOne({
            userId : userId,
            courseId : courseId
        })

        if(enrollment == null){
            res.json({enrolled : false})
        }else{
            res.json({enrolled : true})
        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}



// GET USERS ENROLLED IN A COURSE (ADMIN)
export async function getUsersByCourse(req,res){

    try{

        if(req.user == null || req.user.isAdmin != true){
            return res.status(403).json({message : "Only admins can view enrolled users"})
        }

        const courseId = req.params.courseId

        const enrollments = await Enrollment.find({courseId : courseId})

        res.json(enrollments)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}



// GET ALL ENROLLMENTS (ADMIN)
export async function getAllEnrollments(req,res){

    try{

        if(req.user == null || req.user.isAdmin != true){
            return res.status(403).json({message : "Only admins can view enrollments"})
        }

        const enrollments = await Enrollment.find()

        res.json(enrollments)

    }catch(err){
        res.status(500).json({message : err.message})
    }

}



// DELETE ENROLLMENT (ADMIN)
export async function deleteEnrollment(req,res){

    try{

        if(req.user == null || req.user.isAdmin != true){
            return res.status(403).json({message : "Only admins can delete enrollments"})
        }

        const enrollment = await Enrollment.findById(req.params.id)

        if(enrollment == null){
            return res.status(404).json({message : "Enrollment not found"})
        }

        await Enrollment.deleteOne({_id : req.params.id})

        res.json({message : "Enrollment deleted successfully"})

    }catch(err){
        res.status(500).json({message : err.message})
    }

}