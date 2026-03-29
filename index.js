import express from 'express'
import mongoose from 'mongoose'
import authenticate from './middlewares/authenticate.js'
import userRouter from './routers/userRouter.js'
import courseRouter from './routers/courseRouter.js'
import enrollmentRouter from './routers/enrollmentRouter.js'
import courseVideoRouter from './routers/coursevideoRouter.js'
import dotenv from 'dotenv'

dotenv.config()

const mongoDBURI = process.env.MONGODB_URI

mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("Connected to MongoDB successfully")
    }
)

const app = express()

app.use( express.json() )

app.use(authenticate)

app.use("/users" , userRouter)
app.use("/courses" , courseRouter)
app.use("/enrollments" , enrollmentRouter)
app.use("/course-videos" , courseVideoRouter)   


app.listen(
    3000 ,
    ()=>{
        console.log('Server started successfully')
        console.log('Listening on port 3000')
    }
)
