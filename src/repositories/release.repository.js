const mongoose = require('mongoose');
const dateformat = require('dateformat');
const Project = mongoose.model('Project');
const { errorGeneralMessages } = require('../util/constants');

const dateFormatString = 'dd/mm/yyyy';

module.exports.getProjectReleases = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title releases projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);
      project = project.toJSON();
      const proj = {
        id: projectId,
        title: project.title,
        releases: project.releases,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };
      proj.releases = proj.releases.map(r =>
        Object.assign({}, r, { releaseDate: dateformat(r.releaseDate, dateFormatString) })
      );
      return resolve(proj);
    })
    .catch(err => reject(err));
});


module.exports.createRelease = (projectId, release, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.releases.push(release);
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});
