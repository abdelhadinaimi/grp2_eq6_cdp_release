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
    {$set: {"tasks.$.state": task.state}}
  );

  if (!project) {
    return errorMessage;
  }
  return {success: true};
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
        console.log(task.assignedContributors);

        if (task)
          return resolve(task);
      }
      return resolve(null);
    })
    .catch(err => reject(err));
});

module.exports.getProjectTasks = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title tasks projectOwner collaborators issues')
    .populate("collaborators._id")
    .then(project => {
      if (!project) return resolve(undefined);

      project = project.toJSON();

      project.tasks.forEach(task => {
        task.linkedIssues = task.linkedIssues.map(linkedIssue => {
          return project.issues.find(issue => issue._id.toString() === linkedIssue.toString());     
        });

        task.assignedContributors = task.assignedContributors.map(assContr =>
          project.collaborators.find(coll => coll._id._id.toString() === assContr._id.toString()));

        task.assigned = !!task.assignedContributors.find(coll => coll._id._id.toString() === userId.toString());
      });

      const proj = {
        id: projectId,
        title: project.title,
        tasks: project.tasks,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };
      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.getMyTasks = (projectId, userId) => new Promise((resolve, reject) => {
  return this
    .getProjectTasks(projectId, userId)
    .then(project => {
      project.tasks = project.tasks.filter(task =>
        !!task.assignedContributors.find(contr => contr._id._id.toString() === userId.toString()));

      return resolve(project);
    })
    .catch(err => reject(err));
});
