import { User } from "../models";
import dotenv from 'dotenv';
import { generateToken } from "../utils/generateJWTToken";
import { Request, Response } from "express";

const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token';

function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,        // JS can't read it → mitigates XSS token theft
        // mitigates CSRF (plus we use JSON, not forms)
       // cookie only over HTTPS in prod
    path: '/',             // send on all routes
    maxAge: 1000 * 60 * 60 , // 1h
  });
}

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
            return res.status(400).json({
                success: false,
                message: "User with this email already exists.",
                data: null
            });
        }
        // Check if username already exists
        const existingUsername = await User.findOne({username: username});
        if(existingUsername){
            return res.status(400).json({
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
        
        // Generate JWT token
        const token = generateToken(newUser);

        setAuthCookie(res , token);
        
        return res.status(201).json({
            success: true,
            message: "User signed up successfully.",
            data: {
                id: newUser._id,
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
        const { email, password } = req.body;
        
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
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password.",
                data: null
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        setAuthCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                fantasyPoints: user.fantasyPoints,
                money: user.money
            }
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
        res.clearCookie(COOKIE_NAME, { path: '/' });
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
