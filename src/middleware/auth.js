const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserToken = require("../models/UserToken");

module.exports = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) return res.status(401).json({ message: "No token" });

        const token = bearer.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const tokenExists = await UserToken.findOne({
            userId: decoded.id,
            token
        });

        if (!tokenExists)
            return res.status(401).json({ message: "Session expired. Login again." });

        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
