const projectRepo = require('../repositories/project.repository');
const {global} = require('../util/constants');

module.exports.getProject = (req, res) => {
  const projectId = req.params.projectId;
  res.status(200).render('project/project', {
    appName: global.app.name,
    pageTitle: projectId,
    username: req.session.user.username,
    projectId: projectId
  });
};

module.exports.getAdd = (req, res) => {
  res.render('project/add-edit', {
    appName: global.app.name,
    pageTitle: 'Nouveau Projet',
    username: req.session.user.username,
    errors: [],
    values: undefined,
    editing: false
  });
};

module.exports.postAdd = (req, res) => {
  const project = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    projectOwner: req.session.user
  };

  if (!req.validation.success) {
    return res.status(422).render('project/add-edit', {
      appName: global.app.name,
      pageTitle: 'Nouveau Projet',
      username: req.session.user.username,
      errors: req.validation.errors,
      values: {title: project.title, dueDate: project.dueDate, description: project.description},
      editing: false
    });
  }

  projectRepo
    .createProject(project)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('project/add-edit', {
          appName: global.app.name,
          pageTitle: 'Nouveau Projet',
          username: req.session.user.username,
          errors: result.errors,
          values: {title: project.title, dueDate: project.dueDate, description: project.description},
          editing: false
        });
      }

      req.flash('toast', 'Projet créé avec succès !');
      return res.status(201).redirect('/');
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};

module.exports.getEdit = (req, res) => {
  projectRepo
    .getProjectById(req.params.projectId)
    .then(project => {
      return res.render('project/add-edit', {
        appName: global.app.name,
        pageTitle: 'Éditer Projet',
        username: req.session.user.username,
        errors: [],
        values: project,
        editing: true
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    })
};

module.exports.putEdit = (req, res) => {
  const project = {
    id: req.params.projectId,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate
  };

  if (!req.validation.success) {
    return res.status(422).render('project/add-edit', {
      appName: global.app.name,
      pageTitle: 'Éditer Projet',
      username: req.session.user.username,
      errors: req.validation.errors,
      values: {id: project.id, title: project.title, dueDate: project.dueDate, description: project.description},
      editing: true
    });
  }

  projectRepo
    .updateProject(project)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('project/add-edit', {
          appName: global.app.name,
          pageTitle: 'Éditer Projet',
          username: req.session.user.username,
          errors: result.errors,
          values: {id: project.id, title: project.title, dueDate: project.dueDate, description: project.description},
          editing: true
        });
      }

      req.flash('toast', 'Projet mis à jour !');
      return res.status(201).redirect('/projects/' + project.id);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect('/500');
    });
};

module.exports.deleteDelete = (req, res) => {

};
