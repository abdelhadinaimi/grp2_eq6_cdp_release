const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Sprint = mongoose.model('Sprint');
const { errorGeneralMessages } = require('../util/constants');

module.exports.getProjectSprints = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({ _id: projectId, 'collaborators._id': userId }, 'sprints projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);

      const proj = {
        id: projectId,
        sprints: project.sprints,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };

      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.createSprint = (projectId, sprint, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({ success: false, error: errorGeneralMessages.notAllowed });
  
  const newSprint = new Sprint();
  console.log(sprint);

  if (sprint.id)
    newSprint.id = sprint.id;
  if (sprint.startDate && sprint.startDate.length > 0) {
    const [day, month, year] = sprint.startDate.split('/');
    newSprint.startDate = new Date(year, month - 1, day);
  }
  if (sprint.endDate && sprint.endDate.length > 0) {
    const [day, month, year] = sprint.endDate.split('/');
    newSprint.endDate = new Date(year, month - 1, day);
  }
  if (sprint.description && sprint.description.length > 0)
    newSprint.description = sprint.description;

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({ success: false, error: errorGeneralMessages.notAllowed });
      }

      project.sprints.push(newSprint);
      return project.save();
    })
    .then(() => resolve({ success: true }))
    .catch(err => reject(err));
});

module.exports.deleteSprint = (projectId, sprintId, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(sprintId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(errorMessage);

  return Project
    .findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      project.sprints = project.sprints.filter(sprint => sprint._id.toString() !== sprintId.toString());
      project.tasks.forEach(task => {
        if(task.linkedSprint.toString() === sprintId.toString()){
          task.linkedSprint = null;
        }
      });
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});
