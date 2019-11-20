const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');

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
      project.tasks.map(task => {
        task.linkedIssues = task.linkedIssues.filter(issue => issue.toString() !== issueId.toString());
        return task;
      });
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.getProjectIssues = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title issues projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);
      const proj = {id: projectId, title: project.title, issues: project.issues, projectOwner: project.projectOwner, collaborators: project.collaborators};
      return resolve(proj);
    })
    .catch(err => reject(err));
});
