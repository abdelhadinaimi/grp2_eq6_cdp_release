const mongoose = require('mongoose');
const Project = mongoose.model('Project');

const dateformat = require('dateformat');

module.exports.createProject = async project => new Promise((resolve, reject) => {
  const newProject = new Project();
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
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.updateProject = project => new Promise((resolve, reject) => {
  Project
    .findById(project.id)
    .then(projectToUpdate => {
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

module.exports.deleteProject = async (projectId, userId) => {
  const foundProject = await Project.findById(projectId);

  if (!foundProject) {
    return {success: false, errors: {error: "projet non trouve"}};
  }
  if(foundProject.projectOwner.toString() !== userId.toString()) {
    return {success: false, errors: {error:"Vous n'êtes pas authorisé"}};
  }
  try{
    await foundProject.delete();
  }catch(error){
    return {success: false, errors: {error:error}};
  }
  return {success: true};
};

module.exports.getProjectById = projectId => new Promise((resolve, reject) => {
  Project
    .findById(projectId, 'title description dueDate')
    .then(project => {
      const proj = {id: projectId, title: project.title};

      if (project.description)
        proj.description = project.description;
      if (project.dueDate)
        proj.dueDate = dateformat(project.dueDate, 'dd/mm/yyyy');

      resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.getProjectsByContributorId = contributorId => new Promise((resolve, reject) => {
  Project
    .find({'collaborators._id': contributorId}, 'title description createdAt dueDate collaborators')
    .then(projects => {
      projects = projects.map(project => {
        const newProject = {id: project._id, title: project.title};
        newProject.contributorNb = project.collaborators.length;
        newProject.beginDate = dateformat(project.createdAt, 'dd/mm/yyyy');

        if (project.description)
          newProject.description = project.description;
        if (project.dueDate)
          newProject.endDate = dateformat(project.dueDate, 'dd/mm/yyyy');

        return newProject;
      });

      return resolve(projects);
    })
    .catch(err => reject(err));
});

