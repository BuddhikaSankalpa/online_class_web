import Course from "../models/course.js"


// CREATE COURSE FUNCTION
export async function createCourse(req,res){

    // Only admin users can create courses
    if(req.user != null && req.user.isAsdmin){

        try{

            const course = await Course.findOne({courseId : req.body.courseId})

            // Check whether the course already exists
            if(course != null){
                res.status(400).json({message : "Course already exists"})
                return
            }

            const newCourse = new Course(req.body)

            await newCourse.save()

            res.json({message : "Course created successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can create courses"})
        return
    }

}




// GET ALL COURSES FUNCTION
export async function getAllCourses(req,res){

    try{

        // If the logged user is admin, return all courses
        if(req.user != null && req.user.isAdmin){

            const courses = await Course.find()
            res.json(courses)

        }

        // Otherwise return only available courses
        else{

            const courses = await Course.find({isAvailable : true})
            res.json(courses)

        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// GET COURSE BY ID FUNCTION
export async function getCourseById(req,res){

    try{

        const course = await Course.findOne({courseId : req.params.courseId})

        // Check whether the course exists
        if(course == null){
            res.status(404).json({message : "Course not found"})
            return
        }

        // If the course is available, allow access
        if(course.isAvailable){
            res.json(course)
        }

        // If the course is not available, only admin can view
        else{

            if(req.user != null && req.user.isAdmin){
                res.json(course)
            }else{
                res.status(403).json({message : "Only admins can view unavailable courses"})
                return
            }

        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}




// UPDATE COURSE FUNCTION
export async function updateCourse(req,res){

    // Only admin users can update courses
    if(req.user != null && req.user.isAdmin){

        try{

            // Prevent updating courseId
            if(req.body.courseId != null){
                res.status(400).json({message : "courseId cannot be updated"})
                return
            }

            const course = await Course.findOne({courseId : req.params.courseId})

            // Check whether the course exists
            if(course == null){
                res.status(404).json({message : "Course not found"})
                return
            }

            await Course.updateOne({courseId : req.params.courseId}, req.body)

            res.json({message : "Course updated successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can update courses"})
        return
    }

}




// DELETE COURSE FUNCTION
export async function deleteCourse(req,res){

    // Only admin users can delete courses
    if(req.user != null && req.user.isAdmin){

        try{

            const course = await Course.findOne({courseId : req.params.courseId})

            // Check whether the course exists
            if(course == null){
                res.status(404).json({message : "Course not found"})
                return
            }

            await Course.deleteOne({courseId : req.params.courseId})

            res.json({message : "Course deleted successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can delete courses"})
        return
    }

}