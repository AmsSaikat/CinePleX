import mongoose from "mongoose";

const squadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Squad name is required"],
      trim: true,
      unique: true,
      maxlength: [30, "Squad name cannot exceed 30 characters"],
    },
    tag: {
      type: String,
      required: [true, "Squad tag/callsign is required"],
      uppercase: true,
      trim: true,
      maxlength: [5, "Tag cannot exceed 5 characters (e.g. TF141)"],
    },
    motto: {
      type: String,
      default: "Honor through execution.",
      maxlength: [100, "Motto too long"],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxMembers: {
      type: Number,
      default: 5,
      min: [2, "Squad must hold at least 2 operatives"],
      max: [20, "Squad size capped at 20 operatives"],
    },
    isPrivate: {
      type: Boolean,
      default: false, // If true, requires invitation/approval to join
    },
    minClearanceLevel: {
      type: String,
      enum: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "CLASSIFIED"],
      default: "LEVEL_1",
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["LEADER", "OFFICER", "OPERATIVE"],
          default: "OPERATIVE",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Pending join requests (for private squads)
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "DISBANDED", "IN_MISSION"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const Squad = mongoose.model("Squad", squadSchema);
export default Squad