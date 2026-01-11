import {User} from "../model/userModel.js";
import bcrypt from "bcryptjs";
import {GenerateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js"



// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    GenerateTokenAndSetCookie(res,newUser._id)

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({
        message: "No account is registered with this email",
      });
    }

    // Compare password
    const passValidity = await bcrypt.compare(password, isUser.password);
    if (!passValidity) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    // Remove password before sending response
    const { password: pwd, ...user } = isUser._doc;

    GenerateTokenAndSetCookie(res,isUser._id)

    return res.status(200).json({
      message: "Logged in successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ================= LOGOUT =================
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// ================= CHECK-AUTH =================
export const checkAuth=async(req,res)=>{
  try {
    const user=await User.findById(req.userId).select("-password")

    if(!user){
      return res.status(400).json({success:false,message:"User not found"})
    }

    res.status(200).json({success:true, user
    })
  } catch (error) {
    console.log("Error in checkAuth",error)
    res.status(400).json({success:false,message:error.message})
  }
} 