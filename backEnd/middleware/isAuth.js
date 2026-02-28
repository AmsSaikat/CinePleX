import jwt from "jsonwebtoken"

export const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token"
      })
    }

    req.userId = decoded.id
    next()

  } catch (error) {
    console.log("Error in isAuth:", error)
    return res.status(401).json({
      success: false,
      message: "Unauthorized - token error"
    })
  }
}