const global = require('../util/constants').global;

module.exports.getIndexConnected = (req, res) => {
    res.render('index/index-connected', {

    });
};

module.exports.getIndexNotConnected = (req, res) => {
    res.render('index/index-not-connected', {
        appName: global.app.name,
        pageTitle: 'Accueil'
    });
};