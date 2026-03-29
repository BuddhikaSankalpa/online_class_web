import express from 'express';
import { createUser, loginUser, getAllUsers ,getUserById ,deleteUser , updateUser } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)

userRouter.get("/",getAllUsers)
userRouter.get("/:email",getUserById)
userRouter.delete("/:email",deleteUser)
userRouter.put("/:email",updateUser)

export default userRouter