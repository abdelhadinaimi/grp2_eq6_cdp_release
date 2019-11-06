const mongoose = require('mongoose');
const Project = mongoose.model('Project');

const dateformat = require('dateformat');

module.exports.createProject = project => new Promise((resolve, reject) => {
  const newProject = new Project();
  if (project.id)
    newProject._id = project.id;
  newProject.title = project.title;
  if (project.dueDate && project.dueDate.length > 0) {
    const [day, month, year] = project.dueDate.split('/');
    newProject.dueDate = new Date(year, month - 1, day);
  }
  if (project.description && project.description.length > 0) {
    newProject.description = project.description;
  }
  newProject.projectOwner = project.projectOwner;
  newProject.collaborators = [{
    _id: project.projectOwner,
    userType: 'po',
    addedBy: project.projectOwner
  }];
  newProject.issues = [];

  newProject
    .save()
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.updateProject = (project, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(project.id) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: 'Modification non Autorisée !'});

  Project
    .findOne({_id: project.id, projectOwner: userId})
    .then(projectToUpdate => {
      if (!projectToUpdate) return resolve({success: false, error: 'Modification non Autorisée !'});

      projectToUpdate.title = project.title;
      if (project.dueDate && project.dueDate.length > 0) {
        const [day, month, year] = project.dueDate.split('/');
        projectToUpdate.dueDate = new Date(year, month - 1, day);
      } else {
        projectToUpdate.dueDate = undefined;
      }
      if (project.description && project.description.length > 0)
        projectToUpdate.description = project.description;
      else
        projectToUpdate.description = undefined;

      return projectToUpdate.save()
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err))
});

module.exports.deleteProject = (projectId, userId) => new Promise(resolve => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, errors: {error: "Suppression non Autorisée !"}});

  Project
    .findOne({_id: projectId, projectOwner: userId})
    .then(project => {
      if (!project)
        return resolve({success: false, errors: {error: "Suppression non Autorisée !"}});

      return project.delete();
    })
    .then(() => resolve({success: true}))
    .catch(err => resolve({success: false, errors: {error: err}}));
});

module.exports.getProjectById = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title description dueDate')
    .then(project => {
      if (!project) return resolve(undefined);

      const proj = {id: projectId, title: project.title};
      if (project.description)
        proj.description = project.description;
      if (project.dueDate)
        proj.dueDate = dateformat(project.dueDate, 'dd/mm/yyyy');
      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.getProjectsByContributorId = contributorId => new Promise((resolve, reject) => {
  Project
    .find({'collaborators._id': contributorId}, 'title description createdAt dueDate collaborators projectOwner')
    .then(projects => {
      projects = projects.map(project => {
        const newProject = {id: project._id, title: project.title};
        newProject.contributorNb = project.collaborators.length;
        newProject.beginDate = dateformat(project.createdAt, 'dd/mm/yyyy');
        if (project.description)
          newProject.description = project.description;
        if (project.dueDate)
          newProject.endDate = dateformat(project.dueDate, 'dd/mm/yyyy');
        if (project.projectOwner.toString() === contributorId.toString()) {
          newProject.deleteEdit = true;
        }

        return newProject;
      });

      return resolve(projects);
    })
    .catch(err => reject(err));
});

module.exports.getProjectIssues = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

    Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title issues')
    .then(project => {
      if (!project) return resolve(undefined);
      const proj = {id: projectId, title: project.title, issues: project.issues};
    return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.checkIfProjectOwner = (projectId, userId) => new Promise(resolve => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(false);

  Project
    .findOne({_id: projectId, projectOwner: userId})
    .then(project => {
      return project ? resolve(true) : resolve(false);
    });
});