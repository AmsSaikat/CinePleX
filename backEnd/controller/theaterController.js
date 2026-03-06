import Theater from '../model/theaterModel.js'



/* ================= CREATE THEATER ================= */
export const createTheater = async (req, res) => {
  try {
    const { title, collections } = req.body;

    let theaterCode;

    // Generate until unique
    do {
      theaterCode = [...Array(6)]
        .map(() =>
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
            Math.floor(Math.random() * 36)
          ]
        )
        .join("")
        .match(/.{1,3}/g)
        .join("-");
    } while (await Theater.findOne({ code: theaterCode }));

    const newTheater = await Theater.create({
      title,
      collections,
      code: theaterCode,   // ✅ SAVE THE CODE
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Theater created successfully",
      data: newTheater,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create theater",
      error: error.message,
    });
  }
};

/* ================= GET ALL THEATERS ================= */
export const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find()
      .populate("owner", "name email")
      .populate("collections");

    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch theaters",
      error: error.message,
    });
  }
};

/* ================= GET SINGLE THEATER ================= */
export const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id)
      .populate("owner", "name email")
      .populate("collections");

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    res.status(200).json({
      success: true,
      data: theater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch theater",
      error: error.message,
    });
  }
};



/* ================= GET MY THEATERS ================= */
export const getMyTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find({
      owner: req.userId,
    }).populate("collections");

    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your theaters",
      error: error.message,
    });
  }
};


/* ================= UPDATE THEATER ================= */
export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    // Only owner can update
    if (theater.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this theater",
      });
    }

    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Theater updated successfully",
      data: updatedTheater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update theater",
      error: error.message,
    });
  }
};

/* ================= DELETE THEATER ================= */
export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    // Only owner can delete
    if (theater.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this theater",
      });
    }

    await theater.deleteOne();

    res.status(200).json({
      success: true,
      message: "Theater deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete theater",
      error: error.message,
    });
  }
};



/* ================= JOIN THEATER ================= */
export const joinTheater = async (req, res) => {
  try {
    let { code } = req.body;

    code = code.toUpperCase();

    if (code.length === 6) {
      code = `${code.slice(0,3)}-${code.slice(3)}`;
    }

    const theater = await Theater.findOne({ code });

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found"
      });
    }

    // prevent duplicate join
    if (theater.audience.some(id => id.toString() === req.userId.toString())) {
      return res.status(200).json({
        success: true,
        message: "Already joined",
        data:theater
      });
    }

    // check max capacity
    if (theater.audience.length >= theater.maxAudience) {
      return res.status(400).json({
        success: false,
        message: "Theater is full"
      });
    }

    theater.audience.push(req.userId);
    await theater.save();

    res.status(200).json({
      success: true,
      message: "Joined successfully",
      data: theater
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};