import { User } from "../models";
import dotenv from 'dotenv';
import { generateAccessToken } from "../utils/generateJWTToken";
import { Request, Response } from "express";
// import jwt from 'jsonwebtoken';

dotenv.config();

// const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

exports.signup = async (req: Request, res: Response) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;

        // Validate input
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: email, username, and password.",
                data: null
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
                data: null
            });
        }
        // Check if username already exists
        const existingUsername = await User.findOne({username: username});
        if(existingUsername){
            return res.status(409).json({
                success: false,
                message: "Username already exists. Please choose a different username.",
                data: null
            });
        }
        //Create new user
        const newUser = new User({
            email,
            username,
            password,
            fantasyPoints: 0,
            money: 0,
            role: 'user',
            createdAt: new Date()
        });
        await newUser.save();
        
        return res.status(201).json({
            success: true,
            message: "User signed up successfully.",
            data: {
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                fantasyPoints: newUser.fantasyPoints,
                money: newUser.money
            }
        });
    } catch (error) {
        
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

exports.login = async(req: Request, res: Response) => {
    try {
        const { email, 
            password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password.",
                data: null
            });
        }
        
        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
                data: null
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
                data: null
            });
        }

        const accessToken = generateAccessToken((user as any)._id.toString());
        // const refreshToken = generateRefreshToken((user as any)._id.toString());

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     path: "/api/v1/users/refresh"  // Match your actual route
        // });   
                

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                email: user.email,
                username: user.username,
                role: user.role,
                fantasyPoints: user.fantasyPoints,
                money: user.money
            },
            accessToken: accessToken,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

exports.logout = async (req: Request, res: Response) => {
    try {
        // res.clearCookie('refreshToken');
        return res.status(200).json({
            success: true,
            message: "Logout successful.",
            data: null
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

exports.me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated', data: null });
  }
  const { _id, email, username, role, createdAt } = req.user;
  return res.json({
    success: true,
    data: { user: { id: _id, email, username, role, createdAt } },
  });
};

// Add the verify function
exports.verify = async (req: Request, res: Response) => {
    try {
        // The authMiddleware already validates the token and adds user to req.user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                data: null
            });
        }

        // Get full user data from database
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token verified successfully",
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                fantasyPoints: user.fantasyPoints,
                money: user.money,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during token verification",
            data: null,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// exports.refresh = async (req: Request, res: Response) => {
//     try {
//         const token = req.cookies.refreshToken;
//         if (!token) {
//             return res.status(401).json({ message: "No refresh token" });
//         }

//         const decoded = jwt.verify(token, REFRESH_SECRET) as any;
//         const accessToken = generateAccessToken(decoded.userId);
        
//         return res.json({ accessToken });
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid refresh token'
//         });
//     }
// }