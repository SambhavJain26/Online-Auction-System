const jwt = require("jsonwebtoken");
const userModel = require("../models/users-model");
const { isDbConnected, inMemoryUsers } = require("../config/dbStore");

module.exports = async function (req, res, next) {
    if (!req.cookies.user_token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {
        const jwtKey = process.env.JWT_KEY || "auction_jwt_secret_key_change_in_production_2026";
        let decoded = jwt.verify(req.cookies.user_token, jwtKey);
        let user;
        if (isDbConnected()) {
            user = await userModel
                .findOne({ email: decoded.email })
                .select("-password");
        } else {
            user = inMemoryUsers.find(u => u.email === decoded.email || u._id === decoded.id);
        }

        if (!user) {
            req.flash("error", "User session invalid. Please log in again.");
            return res.redirect("/");
        }

        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "Session expired or invalid.");
        res.redirect("/");
    }
};
