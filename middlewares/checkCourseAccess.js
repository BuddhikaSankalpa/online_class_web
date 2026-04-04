import Enrollment from "../models/enrollment.js"

export default async function checkCourseAccess(req, res, next){

    try{

        // user must be logged in to access course content
        if(req.user == null){
            res.status(401).json({message : "Login required"})
            return
        }

        const userId = req.user.email
        const courseId = req.params.courseId

        // check enrollment
        const enrollment = await Enrollment.findOne({
            userId : userId,
            courseId : courseId
        })

        // if user is not enrolled, deny access
        if(enrollment == null){
            res.status(403).json({message : "You must buy this course first"})
            return
        }

        // if user enrolled, allow access
        next()

    }catch(err){
        res.status(500).json({message : err.message})
    }

}