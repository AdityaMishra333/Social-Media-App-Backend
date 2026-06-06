const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if(!token) return res.status(401).json({ message: "Unauthorised" })

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        req.user.id = req.user._id || req.user.id
        next()
    } catch(err) {
        console.log("JWT error:", err.message)
        return res.status(401).json({ message: "Invalid token" })
    }
}