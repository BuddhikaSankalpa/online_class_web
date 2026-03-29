import express from 'express';
import { 
    enrollCourse,
    getMyCourses,
    checkEnrollment,
    getUsersByCourse,
    getAllEnrollments,
    deleteEnrollment
} from '../controllers/enrollmentController.js';

const enrollmentRouter = express.Router();
enrollmentRouter.post("/", enrollCourse);
enrollmentRouter.get("/my", getMyCourses);
enrollmentRouter.get("/all", getAllEnrollments);//ADMIN ROUTE
enrollmentRouter.get("/check/:courseId", checkEnrollment);
enrollmentRouter.get("/course/:courseId", getUsersByCourse);//ADMIN ROUTE
enrollmentRouter.delete("/:id", deleteEnrollment);//ADMIN ROUTE


export default enrollmentRouter;