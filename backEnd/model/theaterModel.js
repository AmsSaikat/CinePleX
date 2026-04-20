import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "Untitled Theater",
    },

    collections: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // this is your host
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    maxAudience: {
      type: Number,
      default: 10,
    },

    audience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    isLocked: {
      type: Boolean,
      default: false,
    },

    chatEnabled: {
      type: Boolean,
      default: true,
    },

    reactionsEnabled: {
      type: Boolean,
      default: true,
    },

    // Optional: keep track of moderators (if you want host to assign)
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // Current movie being watched
    currentMovies: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;