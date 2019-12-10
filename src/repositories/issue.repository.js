/**
 * issue repository module
 * @module repositories/issue
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');

/**
 * add an issue into a project
 * @param {string} projectId - the id of the project to add the issue in
 * @param {Object} issue - the issue to add
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.createIssue = (projectId, issue, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.issues.push(issue);
      return project.save()
        .then(() => resolve({success: true}))
        .catch(() => resolve({success: false, error: "Erreur interne"}));
    })
    .catch(err => reject(err));
});

/**
 * updates an issue in a project
 * @param {string} projectId - the id of the project to update the issue in
 * @param {Object} issue - the issue to update
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.updateIssue = (projectId, issue, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return resolve(errorMessage);
  }
  const set = {};
  for (const field in issue) {
    if (field !== '_id') {
      set[`issues.$.${field}`] = issue[field];
    }
  }
  return Project.findOneAndUpdate({
    _id: projectId,
    collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po", "pm"]}}},
    "issues._id": issue._id
  }, {$set: set})
    .then(project => {
      if (!project) return resolve(errorMessage);
      return resolve({success: true});
    })
    .catch(err => reject(err));
});

/**
 * removes an issue from a project given its id
 * @param {string} projectId - the id of the project to remove the issue from
 * @param {string} issueId - the id of the issue to remove
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.deleteIssue = (projectId, issueId, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(issueId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(errorMessage);

  return Project
    .findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      project.issues = project.issues.filter(issue => issue._id.toString() !== issueId.toString());
      project.tasks.forEach(task => {
        task.linkedIssues = task.linkedIssues.filter(issue => issue.toString() !== issueId.toString());
        return task;
      });
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

/**
 * returns a list of issues and tasks of a project given its id
 * @param {string} projectId - the id a project
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.getProjectIssues = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'active issues tasks projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);

      project.issues.forEach(issue => {
        let taskOver = 0;
        issue.tasks = [];

        project.tasks.forEach((task, index) => {
          if (task.linkedIssues.find(iss => iss._id.toString() === issue._id.toString())) {
            task.index = (index + 1);
            task.color = "red-text";
            if (task.state === "DONE") {
              taskOver++;
              task.color = "green-text";
            }

            issue.tasks.push(task);
          }
        });

        if (issue.tasks.length > 0)
          issue.completion = Math.floor(taskOver / issue.tasks.length * 100);
        else
          issue.completion = null;
      });

      const proj = {
        id: projectId,
        active: project.active,
        issues: project.issues,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };

      return resolve(proj);
    })
    .catch(err => reject(err));
});

/**
 * checks if the provided storyId is unique
 * @param {string} projectId - the id of a project
 * @param {Object} issueId - the id of the issue to check
 * @param {string} storyId - the id of the story to check
 * @returns {Promise<boolean>} true if is unique
 */
module.exports.isUniqueStoryId = (projectId, issueId, storyId) => new Promise(resolve => {
  if (!issueId) {
    return Project
      .findOne({_id: projectId, 'issues.storyId': storyId})
      .then(project => {
        if (project)
          return resolve(false);
        return resolve(true);
      });
  } else {
    return Project
      .findOne({_id: projectId, 'issues.storyId': storyId})
      .then(project => {
        if (project) {
          const issueIndex = project.issues.findIndex(issue => issue._id.toString() === issueId.toString() && issue.storyId === storyId);
          if (issueIndex < 0)
            return resolve(false);
        }

        return resolve(true);
      });
  }
});
