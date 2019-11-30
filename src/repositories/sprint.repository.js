/**
 * sprint repository module
 * @module repositories/sprint
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Sprint = mongoose.model('Sprint');
const {errorGeneralMessages} = require('../util/constants');

const dateformat = require('dateformat');
const dateFormatString = 'dd/mm/yyyy';

/**
 * returns a list of a project sprints
 * @param {string} projectId - the id a project
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.getProjectSprints = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'sprints tasks projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(null);

      const sprints = project.sprints.map(sprint => {
        const tasks = [];
        let cost = 0, tasksDone = 0;
        project.tasks.forEach(task => {
          if (task.linkedSprint.toString() === sprint._id.toString()) {
            tasks.push(task);
            cost += task.cost;
            if (task.state === "DONE")
              tasksDone++;
          }
        });

        const today = new Date();
        let completion = null;
        if (sprint.startDate <= today)
          completion = tasks.length !== 0 ? Math.round((tasksDone / tasks.length) * 100) : 0;

        let remaining = null;
        if (sprint.startDate <= today && today <= sprint.endDate)
          remaining = Math.round((sprint.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 2;

        const edit = ((sprint.startDate <= today && today <= sprint.endDate) || (today < sprint.startDate));

        return {
          _id: sprint._id,
          id: sprint.id,
          description: sprint.description,
          startDate: dateformat(sprint.startDate, dateFormatString),
          endDate: dateformat(sprint.endDate, dateFormatString),
          completion,
          remaining,
          cost,
          tasks,
          edit
        };
      });

      return resolve({
        id: projectId,
        sprints: sprints,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      });
    })
    .catch(err => reject(err));
});

/**
 * add a sprint into a project
 * @param {string} projectId - the id of the project to add the sprint in
 * @param {Object} sprint - the sprint to add
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.createSprint = (projectId, sprint, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});
  const newSprint = new Sprint();

  if (sprint.id) {
    newSprint._id = sprint.id;
    newSprint.id = sprint.id;
  }
  if (sprint.startDate && sprint.startDate.length > 0) {
    const [day, month, year] = sprint.startDate.split('/');
    newSprint.startDate = new Date(year, month - 1, day);
  }
  if (sprint.endDate && sprint.endDate.length > 0) {
    const [day, month, year] = sprint.endDate.split('/');
    newSprint.endDate = new Date(year, month - 1, day);
  }
  if (sprint.description && sprint.description.length > 0) {
    newSprint.description = sprint.description;
  }

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.sprints.push(newSprint);
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

/**
 * updates a sprint in a project
 * @param {string} projectId - the id of the project to update the sprint in
 * @param {Object} sprint - the sprint to update
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.updateSprint = (projectId, sprint, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId))
    return resolve(errorMessage);

  if (sprint.startDate && sprint.startDate.length > 0) {
    const [day, month, year] = sprint['startDate'].split('/');
    sprint.startDate = new Date(year, month - 1, day);
  }
  if (sprint.endDate && sprint.endDate.length > 0) {
    const [day, month, year] = sprint['endDate'].split('/');
    sprint.endDate = new Date(year, month - 1, day);
  }

  const set = {};
  for (const field in sprint)
    if (field !== '_id')
      set[`sprints.$.${field}`] = sprint[field];

  return Project
    .findOneAndUpdate({
      _id: projectId,
      collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po", "pm"]}}},
      "sprints._id": sprint._id
    }, {$set: set})
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      return resolve({success: true});
    })
    .catch(err => reject(err));
});

/**
 * removes a sprint from a project given its id
 * @param {string} projectId - the id of the project to remove the sprint from
 * @param {string} sprintId - the id of the sprint to remove
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
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
      project.tasks = project.tasks.filter(task => task.linkedSprint.toString() !== sprintId.toString());

      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

/**
 * returns a sprint by its id
 * @param {string} projectId - the id of a project
 * @param {Object} sprintId - the id of the sprint to check
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.getSprintById = (projectId, sprintId) => new Promise((resolve, reject) => {
  return Project
    .findById(projectId, 'sprints collaborators')
    .populate("collaborators._id")
    .then(project => {
      project = project.toJSON();
      if (project) {
        const sprint = project.sprints.find(sprint => sprint._id.toString() === sprintId.toString());

        if (sprint) {
          sprint.startDate = dateformat(sprint.startDate, dateFormatString);
          sprint.endDate = dateformat(sprint.endDate, dateFormatString);

          return resolve(sprint);
        }
      }
      return resolve(null);
    })
    .catch(err => reject(err));
});
