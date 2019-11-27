const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Sprint = mongoose.model('Sprint');
const { errorGeneralMessages } = require('../util/constants');

const dateformat = require('dateformat');
const dateFormatString = 'dd/mm/yyyy';

module.exports.getProjectSprints = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({ _id: projectId, 'collaborators._id': userId }, 'sprints projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);

      project.sprints.forEach( sprint => {
        console.log("before: " + sprint.startDate);
        sprint.startDate = dateformat(sprint.startDate, dateFormatString);
        sprint.endDate = dateformat(sprint.endDate, dateFormatString);
        console.log("after: " + sprint.startDate);
      });

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

  if (sprint.id) {
    newSprint._id = sprint.id;
    newSprint.id  = sprint.id;
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
        return resolve({ success: false, error: errorGeneralMessages.notAllowed });
      }

      project.sprints.push(newSprint);
      return project.save();
    })
    .then(() => resolve({ success: true }))
    .catch(err => reject(err));
});

module.exports.updateSprint = (projectId, sprint, userId) => new Promise((resolve, reject) => {
  const errorMessage = { success: false, error: errorGeneralMessages.modificationNotAllowed };

  if (!mongoose.Types.ObjectId.isValid(projectId))
    return resolve(errorMessage);

  let startDate, endDate;
  if (sprint['startDate'] && sprint['startDate'].length > 0) {
    const [day, month, year] = sprint['startDate'].split('/');
    startDate = new Date(year, month - 1, day);
  }
  if (sprint['endDate'] && sprint['endDate'].length > 0) {
    const [day, month, year] = sprint['endDate'].split('/');
    endDate = new Date(year, month - 1, day);
  }

  const set = {};
  for (const field in sprint) {
    if (field !== '_id')
      set[`sprints.$.${field}`] = sprint[field];
    if (field === 'startDate')
      set[`sprints.$.${field}`] = startDate;
    if (field === 'endDate')
      set[`sprints.$.${field}`] = endDate;
  }

  return Project
    .findOneAndUpdate({
      _id: projectId,
      collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po", "pm"]}}},
      "sprints._id": sprint._id
    }, { $set: set })
    .then(project => {
      console.log("passing here");
      if (!project)
        return resolve(errorMessage);
      console.log("not passing here");
      return resolve({ success: true });
    })
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
