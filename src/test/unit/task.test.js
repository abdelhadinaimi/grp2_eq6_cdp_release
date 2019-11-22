const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const taskRepo = require('../../repositories/task.repository');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const fakeUserId1 = '5dbccabe7d93dd0015eac666';
const fakeUserId2 = '5dbccabe7d93dd0015eac667';
const fakeProjectId = '5dbccabe7d93dd0015eac668';
const fakeTaskId = '5dbccabe7d93dd0015eac669';

const buildUser = user => Object.assign({}, {
  username: 'Unit Tester',
  password: 'password',
  email: 'unittester@test.fr'
}, user);

const buildProject = project => Object.assign({},{
  _id: '5dbccabe7d93dd0015eac668',
  title: 'Test Project',
  description: 'Test Description',
  projectOwner: fakeUserId1,
  tasks :[],
  collaborators:[{
    _id:fakeUserId1,
    userType:"po"
  },
  {
    _id:fakeUserId2,
    userType:"user"
  }]
}, project);

const buildTask = task => Object.assign({},{
    description: "description",
    definitionOfDone: "definitionOfDone",
    cost: 0.5,
    testLink: "testLink"
}, task);

describe('UT Task Repository', () => {
  before((done) => {
    buildConnection('unit-test')
      .then(() => done())
      .catch(err => {
        throw new Error(err);
      })
  });

  beforeEach(async () => {
    await Project.deleteMany({});
    await User.deleteMany({});
    await User.create(buildUser({_id:fakeUserId1}));
    await Project.create(buildProject({_id:fakeProjectId}));
  });

  describe('Task Creation', () => {
    it('Create a new task - should be ok', async () => {
      const task = buildTask();
      const result = await taskRepo.createTask(fakeProjectId, task, fakeUserId1);
      expect(result.success).to.be.true;
    });

    it('Create a new task, but a required field is empty - should raise an error', async () => {
      const result = await taskRepo.createTask(fakeProjectId, buildTask({description:null}), fakeUserId1);
      expect(result.success).to.be.false;
    });
  });

  describe('Task Update', () => {
    it('Update a task - should be ok', async () => {
      const project = await Project.findById(fakeProjectId);
      project.tasks.push(buildTask());
      await project.save();

      const task = {
        description: "description2",
        definitionOfDone: "definitionOfDone2",
        cost: 0.5,
        testLink: "testLink2"
      };
      const result = await taskRepo.updateTask(
        fakeProjectId,
        { ...task, _id: project.tasks[0]._id.toString() },
        fakeUserId1
      );
      expect(result.success).to.be.true;
      expect((await Project.findById(fakeProjectId)).tasks[0]).to.contain(task);
    });

    it('Update a task, but task doesn\'t exist - should raise an error', done => {
      taskRepo.updateTask(fakeProjectId, buildTask({_id: fakeProjectId}), fakeUserId1)
        .then(result => {
          expect(result.success).to.be.false;
          done();
        });
    });
  });

  describe('Task Delete', () => {
    it('Delete a task - should be ok', async () => {
      const project = await Project.findById(fakeProjectId);
      project.tasks.push(buildTask());
      await project.save();

      const result = await taskRepo.deleteTask(fakeProjectId, fakeTaskId, fakeUserId1);
      expect(result.success).to.be.true;
    });

    it('Delete a task, but task doesn\'t exist - should raise an error', done => {
      taskRepo
        .deleteTask(fakeProjectId, buildTask({_id: fakeProjectId}), fakeUserId1)
        .then(result => {
          expect(result.success).to.be.false;
          done();
        });
    });

    it('Delete a task, but user is unauthorized - should raise an error', async () => {
      const project = await Project.findById(fakeProjectId);
      project.tasks.push(buildTask({_id: fakeTaskId}));
      await project.save();

      const result = await taskRepo.deleteTask(fakeProjectId, buildTask(), fakeUserId2);
      expect(result.success).to.be.false;
    });
  });

  after(done => {
    Project
      .deleteMany({})
      .then(() => User.deleteMany({}))
      .then(() => mongoose.disconnect())
      .then(() => done())
      .catch(err => {
        throw new Error(err);
      })
  });
});
