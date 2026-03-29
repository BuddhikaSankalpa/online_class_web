    import express from 'express';
import { 
    createCourse, 
    getAllCourses, 
    getCourseById, 
    updateCourse, 
    deleteCourse 
} from '../controllers/courseController.js';

const courseRouter = express.Router();


courseRouter.post("/", createCourse);//ADMIN ROUTE
courseRouter.put("/:courseId", updateCourse);//ADMIN ROUTE
courseRouter.delete("/:courseId", deleteCourse);//ADMIN ROUTE
courseRouter.get("/", getAllCourses);
courseRouter.get("/:courseId", getCourseById);


export default courseRouter;