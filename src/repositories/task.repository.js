/**
 * task repository module
 * @module repositories/task
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');

/**
 * add a task into a project
 * @param {string} projectId - the id of the project to add the task in
 * @param {Object} task - the task to add
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object representing the result of this operation
 */
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

/**
 * updates a task in a project
 * @param {string} projectId - the id of the project to update the task in
 * @param {Object} task - the task to update
 * @returns {Promise<Object>} an object representing the result of this operation
 */
module.exports.updateTask = (projectId, task) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(task._id))
    return errorMessage;

  const set = {};
  for (const field in task)
    if (field !== '_id')
      set[`tasks.$.${field}`] = task[field];

  return Project
    .findOneAndUpdate({_id: projectId, "tasks._id": task._id}, {$set: set})
    .then(project => {
      if (project)
        return resolve({success: true});
      else
        return resolve(errorMessage);
    })
    .catch(err => reject(err));
});

/**
 * updates a task's state in a project
 * @param {string} projectId - the id of the project to update the task in
 * @param {string} userId - the id of the user who did the operation
 * @param {Object} task - the task to update the state
 * @returns {Promise<Object>} an object representing the result of this operation
 */
module.exports.updateTaskState = async (projectId, userId, task) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return errorMessage;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      "collaborators._id": userId,
      "tasks._id": task._id
    },
    {$set: {"tasks.$.state": task.state, "tasks.$.doneAt": (task.state === "DONE") ? new Date() : null}}
  );

  if (!project)
    return errorMessage;
  return {success: true};
};

/**
 * removes a task from a project given its id
 * @param {string} projectId - the id of the project to remove the task from
 * @param {string} taskId - the id of the task to remove
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object representing the result of this operation
 */
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

/**
 * returns a task by its id
 * @param {string} projectId - the id of a project
 * @param {Object} taskId - the id of the task to check
 * @returns {Promise<Object>} an object representing the result of this operation
 */
module.exports.getTaskById = (projectId, taskId) => new Promise((resolve, reject) => {
  return Project
    .findById(projectId, 'tasks issues collaborators')
    .populate("collaborators._id")
    .then(project => {
      project = project.toJSON();
      if (project) {
        const task = project.tasks.find(task => task._id.toString() === taskId.toString());

        project.issues.forEach(issue => {
          issue.linked = !!task.linkedIssues.find(linkedIssue => linkedIssue.toString() === issue._id.toString());
        });
        project.collaborators.forEach(collaborator => {
          collaborator.linked = !!task.assignedContributors.find(assContr => assContr.toString() === collaborator._id._id.toString());
        });

        task.linkedIssues = project.issues;
        task.assignedContributors = project.collaborators;

        if (task)
          return resolve(task);
      }
      return resolve(null);
    })
    .catch(err => reject(err));
});
