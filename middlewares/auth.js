const jwt = require("jsonwebtoken")


const isLoggedIn = async (req,res,next) => {
    try {
        const token = req.headers.authorization
        if(!token) {
            res.status(401).json({message:"لم يتم الحصول على رمز الدخول"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.currentUser = decoded
        next()

    } catch (e) {
        res.status(403).json(e)
    }
}
module.exports = isLoggedIn