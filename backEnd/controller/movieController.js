import Movie from "../model/movieModel.js"
import Theater from "../model/theaterModel.js"

export const uploadMovie = async (req, res) => {
  try {
    const { title, thumbNail, description, public_id } = req.body;
    const user = req.userId;

    // 1️⃣ Find theater for this user
    const theater = await Theater.findOne({ owner: user });
    if (!theater) {
      return res.status(404).json({ message: "Theater not found for this user." });
    }

    // 2️⃣ Create movie and link to theater
    const movie = await Movie.create({
      title,
      thumbNail,
      description,
      public_id,
      theater: theater._id,
      uploadedBy: user,
    });

    // 3️⃣ Automatically push movie _id to theater
    theater.currentMovies.push(movie._id);
    await theater.save();

    // 4️⃣ Return movie with populated theater info if needed
    const populatedMovie = await Movie.findById(movie._id).populate('theater', 'name');

    return res.status(201).json({ message: "Movie uploaded successfully", movie: populatedMovie });
  }catch (error) {
  console.error("UPLOAD MOVIE ERROR:", error);
  return res.status(500).json({ message: error.message });
}
};



export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
