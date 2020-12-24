const authMiddleware = function(req, res, next){
    if (req.session.email){
        return next();
    }
    res.redirect("/user/user-login-form");
}

module.exports = authMiddleware;