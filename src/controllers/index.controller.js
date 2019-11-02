const global = require('../util/constants').global;

module.exports.getIndex = (req, res) => {
    if (req.session.user) {
        res.render('index/index-connected', {
            appName: global.app.name,
            pageTitle: 'Accueil',
            username: req.session.user.username
        });
    } else {
        res.render('index/index-not-connected', {
            appName: global.app.name,
            pageTitle: 'Accueil'
        });
    }
};