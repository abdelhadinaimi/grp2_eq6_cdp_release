const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const dateformat = require('dateformat');

const dateFormatString = 'dd/mm/yyyy';

module.exports.addDocumentation = (projectId, doc) => new Promise((resolve, reject) => {
  return Project
    .findById(projectId)
    .then(project => {
      if (!project)
        return resolve(false);

      project.docs.push(doc);

      return project.save();
    })
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.getDocumentation = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(null);

  return Project
    .findById(projectId, "projectOwner collaborators docs")
    .populate("collaborators._id")
    .then(project => {
      if (!project)
        return resolve(null);

      const code = [], user = [], admin = [];
      project.docs = project.docs.reverse();
      project.docs.forEach(doc => {
        doc.date = dateformat(doc.createdAt, dateFormatString);

        if (doc.category === "code")
          code.push(doc);
        else if (doc.category === "user")
          user.push(doc);
        else
          admin.push(doc);
      });

      const proj = {
        id: project._id,
        doc: {
          code: code,
          user: user,
          admin: admin
        },
        isPo: (project.projectOwner.toString() === userId.toString()),
        isPm: (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0)
      };

      return resolve(proj);
    })
    .catch(err => reject(err));
});
