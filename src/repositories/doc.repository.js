const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports.getDocumentation = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(null);

  return Project
    .findById(projectId, "projectOwner collaborators")
    .populate("collaborators._id")
    .then(project => {
      if (!project)
        return resolve(null);

      const proj = {
        id: project._id,
        doc: {
          code: [],
          user: [],
          admin: []
        },
        isPo: (project.projectOwner.toString() === userId.toString()),
        isPm: (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0)
      };

      return resolve(proj);
    })
    .catch(err => reject(err));
});
