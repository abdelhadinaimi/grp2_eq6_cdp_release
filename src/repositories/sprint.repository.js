const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Sprint = mongoose.model('Sprint');
const { errorGeneralMessages } = require('../util/constants');

const dateformat = require('dateformat');
const dateFormatString = 'dd/mm/yyyy';

module.exports.getSprint = (projectId, userId, sprintId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({ _id: projectId, 'collaborators._id': userId }, 'sprints tasks projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(null);

      let sprint = project.sprints.find(sprint => sprint._id.toString() === sprintId.toString());
      if (!sprint) return resolve(null);

      const tasks = [];
      let cost = 0, tasksDone = 0;
      if (project.tasks.length > 0) {
        project.tasks.forEach(task => {
          if (task.linkedSprint.toString() === sprint._id.toString()) {
            tasks.push(task);
            cost += task.cost;
            if (task.state === "DONE")
              tasksDone++;
          }
        });
      }

      const today = new Date();
      let completion = null;
      if (sprint.startDate <= today)
        completion = tasks.length !== 0 ? Math.round((tasksDone / tasks.length) * 100) : 0;

      let remaining = null;
      if (sprint.startDate <= today && today <= sprint.endDate)
        remaining = Math.round((sprint.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 2;

      const edit = ((sprint.startDate <= today && today <= sprint.endDate) || (today < sprint.startDate));

      let burndown;
      if (tasks.length > 0) {
        let labels = [];
        const nbDays = Math.round((sprint.endDate.getTime() - sprint.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const ratioPerDay = cost / (nbDays - 1);
        const idealCost = [], realCost = [];
        const associatedTasksToDate = [];
        let totalCost = 0;

        for (let i = 0; i < nbDays; ++i) {
          const date = new Date(sprint.startDate.valueOf());
          date.setDate(sprint.startDate.getDate() + i);
          const dateStr = dateformat(date, dateFormatString);
          labels.push(dateStr);
          associatedTasksToDate[dateStr] = 0;
        }

        for (let i = cost; i >= 0; i -= ratioPerDay)
          idealCost.push(Math.round(i * 100) / 100);

        tasks.forEach(task => {
          totalCost += task.cost;
          if (task.state === 'DONE') {
            const doneDateStr = dateformat(task.doneAt, dateFormatString);
            associatedTasksToDate[doneDateStr] += task.cost;
          }
        });

        labels.forEach(label => {
          totalCost -= associatedTasksToDate[label];
          realCost.push(totalCost);
        });

        burndown = {
          labels: labels,
          datasets: [{
            label: 'Coût Restant Idéal (j/h)',
            borderColor: 'rgb(39, 99, 255)',
            backgroundColor: 'rgb(0, 0, 0, 0)',
            data: idealCost
          }, {
            label: 'Coût Restant Réel',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(0, 0, 0, 0)',
            data: realCost
          }]
        };

        burndown = JSON.stringify(burndown);
      }

      return resolve({
        id: projectId,
        sprint: sprint,
        startDate: dateformat(sprint.startDate, dateFormatString),
        endDate: dateformat(sprint.endDate, dateFormatString),
        completion: completion,
        remaining: remaining,
        cost: cost,
        tasks: tasks,
        edit: edit,
        burndown: burndown,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      });

    })
    .catch(err => reject(err));
});

module.exports.getProjectSprints = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({ _id: projectId, 'collaborators._id': userId }, 'sprints tasks projectOwner collaborators')
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

module.exports.createSprint = (projectId, sprint, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({ success: false, error: errorGeneralMessages.notAllowed });
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
      collaborators: { $elemMatch: { _id: userId, userType: { $in: ["po", "pm"] } } },
      "sprints._id": sprint._id
    }, { $set: set })
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      return resolve({ success: true });
    })
    .catch(err => reject(err));
});

module.exports.deleteSprint = (projectId, sprintId, userId) => new Promise((resolve, reject) => {
  const errorMessage = { success: false, errors: { error: errorGeneralMessages.deleteNotAllowed } };
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
    .then(() => resolve({ success: true }))
    .catch(err => reject(err));
});

module.exports.getSprintById = (projectId, sprintId) => new Promise((resolve, reject) => {
  return Project
    .findById(projectId, 'sprints collaborators')
    .populate("collaborators._id")
    .then(project => {
      project = project.toJSON();
      if (!project) return resolve(null);

      const sprint = project.sprints.find(sprint => sprint._id.toString() === sprintId.toString());
      if (sprint) {
        sprint.startDate = dateformat(sprint.startDate, dateFormatString);
        sprint.endDate = dateformat(sprint.endDate, dateFormatString);

        return resolve(sprint);
      }
    })
    .catch(err => reject(err));
});
