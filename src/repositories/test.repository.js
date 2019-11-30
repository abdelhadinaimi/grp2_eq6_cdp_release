const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports.getProjectTests = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId})
    .then(project => {
      if (!project) return resolve(undefined);
      const proj = {
        id: projectId,
        title: project.title,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators,
        tasksToTest: project.tasks.filter(task => !!task.testLink),
        issuesToTest: project.issues.filter(issue => !!issue.testLink),
        validationTests: []
      };
      return resolve(proj);
    })
    .catch(err => reject(err));
});
