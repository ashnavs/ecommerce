// middleware/customMiddleware.js

const flash = require('connect-flash');

function configureFlash(app) {
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.messages = req.flash();
        next();
    });
}

module.exports = { configureFlash };
