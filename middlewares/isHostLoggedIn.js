const jwt = require("jsonwebtoken");
const hostModel = require("../models/host-model");
const { isDbConnected, inMemoryHosts } = require("../config/dbStore");

module.exports = async function (req, res, next) {
    if (!req.cookies.host_token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {
        const jwtKey = process.env.JWT_KEY || "auction_jwt_secret_key_change_in_production_2026";
        let decoded = jwt.verify(req.cookies.host_token, jwtKey);
        let host;
        if (isDbConnected()) {
            host = await hostModel
                .findOne({ email: decoded.email })
                .select("-password");
        } else {
            host = inMemoryHosts.find(h => h.email === decoded.email);
        }

        if (!host) {
            req.flash("error", "Host session invalid. Please log in again.");
            return res.redirect("/");
        }

        req.host = host;
        next();
    } catch (err) {
        req.flash("error", "Session expired or invalid.");
        res.redirect("/");
    }
};
