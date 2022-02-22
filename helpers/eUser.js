const req = require("express/lib/request");

module.exports = {
    eUser: function(req, res, next) {

        if(req.isAuthenticated() && req.user.eAdmin >= 0) {
            return next();
        }

        req.flash("error_msg", "Você precisa estar logado!")
        res.redirect("/v1/login")

    }
}