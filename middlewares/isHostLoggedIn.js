const jwt = require("jsonwebtoken");
const hostModel = require("../models/host-model");

module.exports = async function (req, res, next) {
    if (!req.cookies.host_token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {
        let decoded = jwt.verify(req.cookies.host_token, process.env.JWT_KEY);
        let host = await hostModel
            .findOne({ email: decoded.email })
            .select("-password");
        req.host = host;
        next();
    } catch (err) {
        req.flash("error", "something went wrong.");
        res.redirect("/");
    }
};
