import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Movie from "../model/movieModel.js";
import Theater from "../model/theaterModel.js";

// Initialize Backblaze B2 S3 Client
const s3Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`, // e.g. s3.us-west-004.backblazeb2.com
  region: process.env.B2_ENDPOINT ? process.env.B2_ENDPOINT.split(".")[0] : "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

// 1️⃣ STEP ONE: Generate Presigned B2 Upload URL
export const getPresignedUploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "fileName and fileType are required." });
    }

    // Clean title and create a unique B2 storage key
    const sanitizedTitle = fileName.toLowerCase().replace(/[^a-z0-9.]/g, "-");
    const key = `movies/${Date.now()}-${sanitizedTitle}`;

    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Valid for 15 minutes
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return res.status(200).json({ uploadUrl, key });
  } catch (error) {
    console.error("PRESIGNED URL ERROR:", error);
    return res.status(500).json({ message: "Failed to generate presigned upload URL." });
  }
};

// 2️⃣ STEP TWO: Save Movie Metadata & Link to Theater
export const saveMovieMetadata = async (req, res) => {
  try {
    const { title, description, category, duration, mediaPath, thumbNail, public_id } = req.body;
    const user = req.userId;

    if (!title || !description || !mediaPath) {
      return res.status(400).json({ message: "Title, description, and mediaPath are required." });
    }

    // Find theater for this user
    const theater = await Theater.findOne({ owner: user });
    if (!theater) {
      return res.status(404).json({ message: "Theater not found for this user." });
    }

    // Create movie record
    const movie = await Movie.create({
      title,
      description,
      category: category || "ACTION",
      duration: duration || "N/A",
      mediaPath, // Stored as '/movies/1715000000-filename.mp4'
      thumbNail: thumbNail || "",
      public_id: public_id || "",
      theater: theater._id,
      uploadedBy: user,
    });

    // Push movie _id to theater
    theater.currentMovies.push(movie._id);
    await theater.save();

    // Populate theater info
    const populatedMovie = await Movie.findById(movie._id).populate("theater", "name");

    return res.status(201).json({
      message: "Movie registered successfully",
      movie: populatedMovie,
    });
  } catch (error) {
    console.error("SAVE METADATA ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// 3️⃣ FETCH ALL MOVIES
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};