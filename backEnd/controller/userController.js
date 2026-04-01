import cloudinary from "../config/cloudinary.js";
import { User } from "../model/userModel.js";

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar, public_id: newPublicId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateFields = {};

    // ✅ Username
    if (username) {
      const trimmed = username.trim();
      if (trimmed.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username too short",
        });
      }
      updateFields.name = trimmed;
    }

    // ✅ Bio
    if (bio !== undefined) {
      updateFields.bio = bio;
    }

    // ✅ Avatar update
    if (avatar && newPublicId) {
      updateFields.avatar = avatar;
      updateFields.public_id = newPublicId;

      // Delete old image safely
      if (user.public_id) {
        try {
          await cloudinary.uploader.destroy(user.public_id);
        } catch (err) {
          console.log("Cloudinary delete failed:", err.message);
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};