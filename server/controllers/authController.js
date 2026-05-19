import User from "../models/User.js";
import bcrypt from "bcrypt";


//generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}
//Register user
export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({message: "Please fill all fields"});
       //check if user already exists
       const existingUser = await User.findOne({email});
       if(existingUser) {
        return res.status(400).json({message: "User already exists"});
       }
       //hash password
         const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        }
        //create user
        const user = new User.create({name,email, password: hashedPassword});
        const token = generateToken(user._id);
        res.status(201).json({success: true, token, user});
    } catch (error) {
        console.error("Register error:", error.message)
        res.status(500).json({message: "Server error"});
    }
}


//Login user
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: "Please fill all fields"});
       
            //find user
       const user = await User.findOne({email});
       if(!user) {
        return res.status(400).json({message: "Invalid credentials"});
       }
       //hash password
         const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        }
        // check password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = generateToken(user._id);
        res.status(201).jsonn({success: true, token, user});
    } catch (error) {
        console.error("Register error:", error.message)
        res.status(500).json({message: "Server error"})
    }
}

//get current user
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({success: true, user});
    } catch (error) {
        console.error("Register error:", error.message)
        res.status(500).json({message: "Server error"})
    }
}