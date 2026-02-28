import Movie from "../model/movieModel"


export const createMovie = async (req, res) => {
  try {
    const { title, videoUrl } = req.body

    const movie = await Movie.create({
      title,
      videoUrl,
      uploadedBy: req.user?._id || null,
    })

    res.status(201).json(movie)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
