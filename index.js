import express from 'express'
import mongoose from 'mongoose'
import authenticate from './middlewares/authenticate.js'
import userRouter from './routers/userRouter.js'
import courseRouter from './routers/courseRouter.js'
import enrollmentRouter from './routers/enrollmentRouter.js'
import courseVideoRouter from './routers/coursevideoRouter.js'
import OrderRouter from './routers/orderRouter.js'
import instructorRouter from './routers/instructorRouter.js'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const mongoDBURI = process.env.MONGODB_URI

mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("Connected to MongoDB successfully")
    }
)

const app = express()

app.use(cors())


//Cross-Origin-Opener-Policy
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});



// app.use(cors(
//     origin: "http://locallhost",
// ))

app.use( express.json() )

app.use(authenticate)

app.use("/api/users" , userRouter)
app.use("/api/courses" , courseRouter)
app.use("/api/enrollments" , enrollmentRouter)
app.use("/api/course-videos" , courseVideoRouter)
app.use("/api/orders" , OrderRouter)   
app.use("/api/instructors", instructorRouter)


app.listen(
    3000 ,
    ()=>{
        console.log('Server started successfully')
        console.log('Listening on port 3000')
    }
)
