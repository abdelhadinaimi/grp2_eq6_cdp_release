const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const projectRepo = require('../../repositories/project.repository');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const fakeUserId1 = '5dbccabe7d93dd0015eac666';
const fakeUserId2 = '5dbccabe7d93dd0015eac667';
const fakeProjectId = '5dbccabe7d93dd0015eac668';
const fakeIssueId = '5dbccabe7d93dd0015eac669';

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
  issues :[],
  collaborators:[{
    _id:fakeUserId1,
    userType:"po"
  },
  {
    _id:fakeUserId2,
    userType:"user"
  }]
}, project);

const buildIssue = issue => Object.assign({},{
  userType: "type",
  userGoal: "userGoal",
  userReason: "userReason",
  storyId: "US01",
  priority: "low",
  testLink: "testLink"
}, issue);

describe('UT Issue Repository', () => {
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

  describe('Issue Creation', () => {
    it('should create a new issue', async () => {
      const issue = buildIssue();
      const result = await projectRepo.createIssue(fakeProjectId,issue,fakeUserId1);
      expect(result.success).to.be.true;
    });

    it('should raise an error if a new issue is created without a required field', async () => {
      let result1 = await projectRepo.createIssue(fakeProjectId,buildIssue({userType:null}),fakeUserId1);
      expect(result1.success).to.be.false;
      let result2 = await projectRepo.createIssue(fakeProjectId,buildIssue({userReason:null}),fakeUserId1);
      expect(result2.success).to.be.false;
    });
  });

  describe('Issue Update', () => {
    it('should update a new issue', async () => {
      const project = await Project.findById(fakeProjectId);
      project.issues.push(buildIssue());
      await project.save();

      const issue = {
        userType: "type2",
        userGoal: "userGoal2",
        userReason: "userReason2",
        storyId: "US013",
        priority: "high",
        testLink: "testLink2"
      };
      const result = await projectRepo.updateIssue(
        fakeProjectId,
        { ...issue, _id: project.issues[0]._id.toString() },
        fakeUserId1
      );
      expect(result.success).to.be.true;
      expect((await Project.findById(fakeProjectId)).issues[0]).to.contain(issue);
    });

    it('shoud raise an error if updating a non existing issue', () => {
      projectRepo.updateIssue(fakeProjectId,buildIssue({_id:fakeProjectId}),fakeUserId1)
      .then( result => { throw new Error()})
      .catch( err => expect(err.success).to.be.false);
    });

    it('shoud raise an error if updating an issue with unauthorized user', async () => {
      const project = await Project.findById(fakeProjectId);
      project.issues.push(buildIssue({_id:fakeIssueId}));
      await project.save();

      projectRepo.updateIssue(fakeProjectId,buildIssue(),fakeUserId2)
      .then( result => { throw new Error()})
      .catch( err => expect(err.success).to.be.false);
    });
  });

  describe('Issue Update', () => {
    it('should delete an issue', async () => {
      const project = await Project.findById(fakeProjectId);
      project.issues.push(buildIssue());
      await project.save();

      const result = await projectRepo.deleteIssue(fakeProjectId,fakeIssueId,fakeUserId1);
      expect(result.success).to.be.true;
    });
    it('should raise an error if deleting a non existing issue', async () => {
      projectRepo.deleteIssue(fakeProjectId,buildIssue({_id:fakeProjectId}),fakeUserId1)
      .then( result => { throw new Error()})
      .catch( err => expect(err.success).to.be.false);
    });
    it('shoud raise an error if deleting an issue with unauthorized user', async () => {
      const project = await Project.findById(fakeProjectId);
      project.issues.push(buildIssue({_id:fakeIssueId}));
      await project.save();

      projectRepo.deleteIssue(fakeProjectId,buildIssue(),fakeUserId2)
      .then( result => { throw new Error()})
      .catch( err => expect(err.success).to.be.false);
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
