const global = require('../util/constants').global;

module.exports.getProject = (req, res) => {
  let projectId = req.params.projectId;
  res.status(200).render('project/project', {
    appName: global.app.name,
    pageTitle: projectId,
    username: req.session.user.username,
    projectId: projectId
  });
};

module.exports.postAdd = (req, res) => {
  const {title} = req.body;
  const {dueDate} = req.body;
  const  {description} = req.body;

  res.send({title: title, dueDate: dueDate, description: description});
};