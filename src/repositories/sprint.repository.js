const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');

module.exports.getProjectSprints = (projectId, userId) => new Promise((resolve, reject) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
      return resolve(undefined);
  
    return Project
      .findOne({_id: projectId, 'collaborators._id': userId}, 'sprints projectOwner collaborators')
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