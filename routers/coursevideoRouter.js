import express from 'express';
import { 
    createCourseVideo,
    getAllCourseVideos,
    getVideosByCourseId,
    getVideoById,
    updateCourseVideo,
    deleteCourseVideo
} from '../controllers/coursevideoController.js';

const courseVideoRouter = express.Router();

courseVideoRouter.post("/", createCourseVideo);//ADMIN ROUTE
courseVideoRouter.get("/all", getAllCourseVideos);//ADMIN ROUTE
courseVideoRouter.put("/:videoId", updateCourseVideo);//ADMIN ROUTE
courseVideoRouter.delete("/:videoId", deleteCourseVideo);//ADMIN ROUTE
courseVideoRouter.get("/course/:courseId", getVideosByCourseId);
courseVideoRouter.get("/:videoId", getVideoById);


export default courseVideoRouter;