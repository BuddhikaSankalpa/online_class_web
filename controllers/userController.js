import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// CREATE USER
export async function createUser(req, res) {

    try {

        //If user is logged in but NOT admin
        if (req.user && req.user.isAdmin === false) {
            res.json({ message: "Only admins can create users" });
            return;
        }

        //Check if email already exists
        const user = await User.findOne({ email: req.body.email });

        if (user != null) {
            res.json({ message: "User already exists" });
            return;
        }

        //Hash password
        const passwordHash = bcrypt.hashSync(req.body.password, 10);

        //Create new user
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        });

        await newUser.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        res.json({ message: err.message });
    }
}



// LOGIN USER
export async function loginUser(req,res){

    try{

        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({email : email})

        if(user == null){
            res.status(404).json({message : "User not found"})
            return
        }

        const isPasswordValid = bcrypt.compareSync(password , user.password)

        if(isPasswordValid){

            const token = jwt.sign(
                {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    isAdmin : user.isAdmin
                },
                process.env.JWT_SECRET_KEY
            )

            res.json({message : "Login successful", token : token})

        }else{
            res.status(401).json({message : "Invalid password"})
        }

    }catch(err){
        res.json({message : err.message})
    }

}



// GET ALL USERS FUNCTION
export async function getAllUsers(req,res){

    // Only admin users are allowed to view all users
    if(req.user != null && req.user.isAdmin){

        try{

            const users = await User.find()

            res.json(users)

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can view users"})
        return
    }

}


// GET USER BY ID FUNCTION
export async function getUserById(req,res){

    try{

        const user = await User.findOne({email : req.params.email})

        // Check whether the user exists
        if(user == null){
            res.status(404).json({message : "User not found"})
            return
        }

        // If the logged user is admin, return the user
        if(req.user != null && req.user.isAdmin){
            res.json(user)
        }

        // If the logged user is the same user, allow access
        else if(req.user != null && req.user.email == user.email){
            res.json(user)
        }

        // Otherwise deny access
        else{
            res.status(403).json({message : "You are not allowed to view this user"})
            return
        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}


// UPDATE USER FUNCTION
export async function updateUser(req,res){

    try{

        const user = await User.findOne({email : req.params.email})

        // Check whether the user exists
        if(user == null){
            res.status(404).json({message : "User not found"})
            return
        }

        // Only admin or the same user can update the profile
        if(req.user != null && (req.user.isAdmin || req.user.email == user.email)){

            // Prevent updating sensitive fields
            if(req.body.email != null){
                res.status(400).json({message : "Email cannot be updated"})
                return
            }

            if(req.body.isAdmin != null){
                res.status(400).json({message : "isAdmin cannot be updated"})
                return
            }

            if(req.body.isBlocked != null){
                res.status(400).json({message : "isBlocked cannot be updated"})
                return
            }

            await User.updateOne({email : req.params.email}, req.body)

            res.json({message : "User updated successfully"})

        }else{
            res.status(403).json({message : "You are not allowed to update this user"})
            return
        }

    }catch(err){
        res.status(500).json({message : err.message})
    }

}


// DELETE USER FUNCTION
export async function deleteUser(req,res){

    // Only admin users are allowed to delete users
    if(req.user != null && req.user.isAdmin){

        try{

            const user = await User.findOne({email : req.params.email})

            // Check whether the user exists
            if(user == null){
                res.status(404).json({message : "User not found"})
                return
            }

            await User.deleteOne({email : req.params.email})

            res.json({message : "User deleted successfully"})

        }catch(err){
            res.status(500).json({message : err.message})
        }

    }else{
        res.status(403).json({message : "Only admins can delete users"})
        return
    }

}