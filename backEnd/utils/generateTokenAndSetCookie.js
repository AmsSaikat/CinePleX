import jwt from "jsonwebtoken"

export const GenerateTokenAndSetCookie = (res, id) => {
  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  const isProduction = process.env.NODE_ENV === "production"

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,                 // MUST be true in production (HTTPS)
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return token
}