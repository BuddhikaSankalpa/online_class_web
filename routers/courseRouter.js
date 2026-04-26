    import express from 'express';
import { 
    createCourse, 
    getAllCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse, 
    searchCourse
} from '../controllers/courseController.js';

const courseRouter = express.Router();


courseRouter.post("/", createCourse);//ADMIN ROUTE
courseRouter.get("/search/:query", searchCourse)
courseRouter.put("/:courseId", updateCourse);//ADMIN ROUTE
courseRouter.delete("/:courseId", deleteCourse);//ADMIN ROUTE
courseRouter.get("/", getAllCourses);
courseRouter.get("/:courseId", getCourseById);


export default courseRouter;