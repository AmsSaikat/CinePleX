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
      required: true,
    },
    code:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

const Theater = mongoose.model("Theater", theaterSchema);

export default Theater;