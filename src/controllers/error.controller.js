const global = require('../util/constants').global;

module.exports.get404 = (req, res) => {
    res.render(global.views.error["404"], {
        appName: global.app.name,
        pageTitle: global.titles.error["404"]
    });
};

module.exports.get500 = (req, res) => {
    res.render(global.views.error["500"], {
        appName: global.app.name,
        pageTitle: global.titles.error["500"]
    });
};
