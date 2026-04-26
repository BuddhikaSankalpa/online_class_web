import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import axios from 'axios';
import nodemailer from "nodemailer";
import Otp from "../models/otp.js"
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "buddhikasankalpa241@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
    }
})

// CREATE USER
export async function createUser(req, res) {

    try {

        //If user is logged in but NOT admin
        if (req.user && req.user.isAdmin === false) {
            return res.json({ message: "Only admins can create users" });
        }

        //Check if email already exists
        const user = await User.findOne({ email: req.body.email });

        if (user != null) {
            return res.json({ message: "User already exists" });
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
        return res.json({ message: "User created successfully" });

    } catch (err) {
        return res.json({ message: err.message });
    }
}



// LOGIN USER
export async function loginUser(req, res) {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({ email: email })
        if (user == null) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "User is blocked. Contact Admin.",
            });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin
                },
                process.env.JWT_SECRET_KEY
            )
            return res.json({
                message: "Login successful",
                token: token,
                isAdmin: user.isAdmin
            })
        } else {
            return res.status(401).json({ message: "Invalid password" })
        }

    } catch (err) {
        return res.json({ message: err.message })
    }
}

// GET USER BY ID
// export async function getUserById(req, res) {
//     try {
//         const user = await User.findOne({ email: req.params.email })
//         if (user == null) {
//             return res.status(404).json({ message: "User not found" })
//         }

//         if (req.user != null && req.user.isAdmin) {
//             return res.json(user)
//         } else if (req.user != null && req.user.email == user.email) {
//             return res.json(user)
//         } else {
//             return res.status(403).json({ message: "You are not allowed to view this user" })
//         }

//     } catch (err) {
//         return res.status(500).json({ message: err.message })
//     }
// }

// DELETE USER
export async function deleteUser(req, res) {
    if (req.user != null && req.user.isAdmin) {
        try {
            const user = await User.findOne({ email: req.params.email })
            if (user == null) {
                return res.status(404).json({ message: "User not found" })
            }

            await User.deleteOne({ email: req.params.email })
            return res.json({ message: "User deleted successfully" })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    } else {
        return res.status(403).json({ message: "Only admins can delete users" })
    }
}

// UPDATE USER
export async function updateUser(req, res) {
    try {
        const user = await User.findOne({ email: req.params.email })
        if (user == null) {
            return res.status(404).json({ message: "User not found" })
        }

        if (req.user == null || (!req.user.isAdmin && req.user.email !== user.email)) {
            return res.status(403).json({ message: "You are not allowed to update this user" })
        }

        if (req.body.email != null) {
            return res.status(400).json({ message: "Email cannot be updated" })
        }
        if (req.body.isAdmin != null) {
            return res.status(400).json({ message: "isAdmin cannot be updated" })
        }
        if (req.body.isBlocked != null) {
            return res.status(400).json({ message: "isBlocked cannot be updated" })
        }

        const allowedFields = ["firstName", "lastName", "image"];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] != null) {
                updateData[field] = req.body[field];
            }
        }

        if (req.body.password != null) {
            updateData.password = bcrypt.hashSync(req.body.password, 10);
        }

        await User.updateOne({ email: req.params.email }, { $set: updateData })
        return res.json({ message: "User updated successfully" })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// GET USER
export function getUser(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    return res.json(req.user)
}

// GOOGLE LOGIN
export async function googleLogin(req, res) {
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        });

        const { email, given_name, family_name, picture } = response.data;

        let user = await User.findOne({ email: email });
        if (!user) {
            user = new User({
                email: email,
                firstName: given_name,
                lastName: family_name,
                password: "google_user_" + Date.now(),
                image: picture,
            });
            await user.save();
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "User is blocked. Contact Admin." });
        }

        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                image: user.image,
            },
            process.env.JWT_SECRET_KEY
        );

        return res.json({
            message: "Login successful",
            token: token,
            isAdmin: user.isAdmin,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Google login failed",
            error: error.message
        });
    }
}

// SEND OTP
export async function sendOTP(req, res) {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email: email });
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }

        await Otp.deleteMany({ email: email });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtp = new Otp({ email: email, otp: otpCode });
        await newOtp.save();

        const message = {
            from: "buddhikasankalpa241@gmail.com",
            to: email,
            subject: "Your OTP Code",
            text: "Your OTP code is " + otpCode
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to send OTP",
                    error: err.message
                });
            } else {
                return res.json({ message: "OTP sent successfully" });
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message
        });
    }
}

// VALIDATE OTP AND UPDATE PASSWORD
export async function validateOTPAndUpdatePassword(req, res) {
    try {
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;
        const email = req.body.email;

        const otpRecord = await Otp.findOne({ email: email, otp: otp });
        if (otpRecord == null) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await Otp.deleteMany({ email: email });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.updateOne(
            { email: email },
            { $set: { password: hashedPassword, isEmailVerified: true } }
        );

        return res.json({ message: "Password updated successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update password",
            error: error.message,
        });
    }
}

// GET ALL USERS
export async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message,
        });
    }
}

// UPDATE USER STATUS (Block/Unblock)
export async function updateUserStatus(req, res) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const email = req.params.email;

    if (req.user.email === email) {
        return res.status(400).json({ message: "Admin cannot change their own status" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.updateOne(
            { email: email },
            { $set: { isBlocked: req.body.isBlocked } }
        );

        return res.json({ message: "User status updated successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating user status",
            error: error.message,
        });
    }

}