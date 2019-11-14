const global = require('../util/constants').global;

module.exports.get404 = (req, res) => {
    res.render('error/404', {
        appName: global.app.name,
        pageTitle: 'Page Non Trouvée'
    });
};

module.exports.get500 = (req, res) => {
    res.render('error/500', {
        appName: global.app.name,
        pageTitle: 'Erreur Interne'
    });
};
