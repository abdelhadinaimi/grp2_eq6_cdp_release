const expect = require('chai').expect;
const mongoose = require('mongoose');
const dateformat = require('dateformat');

const buildConnection = require('../../config/database.config');
const projectRepo = require('../../repositories/project.repository');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const fakeUserId1 = '5dbccabe7d93dd0015eac666';
const fakeUserId2 = '5dbccabe7d93dd0015eac667';
const fakeProjectId = '5dbccabe7d93dd0015eac668';
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

describe('UT Project Repository', () => {
  before((done) => {
    buildConnection('unit-test')
      .then(() => User.create(buildUser({_id:fakeUserId1})))
      .then(() => Project.create(buildProject({_id:fakeProjectId})))
      .then(() => done())
      .catch(err => {
        throw new Error(err);
      })
  });

  describe('Issue Creation', () => {
    it('should create a new issue', async () => {
      const issue = buildIssue();
      const result = await projectRepo.createIssue(fakeProjectId,issue,fakeUserId1);
      expect(result.success).to.be.true;
      //expect((await Project.findById(fakeProjectId)).issues[0].storyId).to.equal(issue.storyId);
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