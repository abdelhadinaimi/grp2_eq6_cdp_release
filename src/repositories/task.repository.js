const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');

module.exports.createTask = (projectId, task, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.tasks.push(task);
      return project.save()
        .then(() => resolve({success: true}))
        .catch(() => resolve({success: false, error: "Erreur interne"}));
    })
    .catch(err => reject(err));
});

module.exports.updateTaskState = async (projectId, userId, task) => {
  const errorMessage = { success: false, error: errorGeneralMessages.modificationNotAllowed };
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)){
    return errorMessage;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      "collaborators._id": userId,
      "tasks._id": task._id
    },
    { $set: { "tasks.$.state": task.state } }
  );

  if (!project) {
    return errorMessage;
  }
  return { success: true };
};

module.exports.deleteTask = (projectId, taskId, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(errorMessage);

  return Project
    .findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      project.tasks = project.tasks.filter(task => task._id.toString() !== taskId.toString());

      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.getProjectTasks = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title tasks projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);
      const proj = {id: projectId, title: project.title, tasks: project.tasks, projectOwner: project.projectOwner, collaborators: project.collaborators};
      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.getMyTasks = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(null);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'tasks')
    .then(project => {
      if (!project) return resolve(null);

      const tasks = project.tasks.filter(task =>
        task.assignedContributors.findIndex(contr => contr._id.toString() === userId.toString()) >= 0);

      return resolve(tasks);
    })
    .catch(err => reject(err));
});
