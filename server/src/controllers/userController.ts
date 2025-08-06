import { User } from "../models";
import { generateToken } from "../utils/generateJWTToken";
import { Request, Response } from "express";

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
        
        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                fantasyPoints: newUser.fantasyPoints,
                money: newUser.money
            },
            token: token
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
            },
            token: token
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