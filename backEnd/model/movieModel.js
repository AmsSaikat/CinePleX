import mongoose from "mongoose"

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    theaterName:{
      type:String,
      required:true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

const Movie=mongoose.model("Movie",movieSchema)
export default Movie
