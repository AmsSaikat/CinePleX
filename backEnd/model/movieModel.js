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
    description: { type: String, required: true },
    thumbNail: { type: String }, // URL or path
    video: { type: String }, // URL or path
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

const Movie=mongoose.model("Movie",movieSchema)
export default Movie
