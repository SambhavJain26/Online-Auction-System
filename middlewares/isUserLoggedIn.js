const jwt = require("jsonwebtoken");
const userModel = require("../models/users-model");

module.exports = async function (req, res, next) {
    if (!req.cookies.user_token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.user_token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");
        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "something went wrong.");
        res.redirect("/");
    }
};
