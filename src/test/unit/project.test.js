const expect = require('chai').expect;
const mongoose = require('mongoose');

const testDatabase = require('../../config/database.test.config');
const projectRepo = require('../../repositories/project.repository');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const userId = '5dbccabe7d93dd0015ea3c20';
const fakeUserId = '5dbccabe7d93dd0015eac666';
const project1Id = '5dbccabe7d93dd0015ea3c21';
const project2Id = '5dbccabe7d93dd0015ea3c22';
const fakeProjectId = '5dbccabe7d93dd0015eac666';

describe('UT Project Repository', () => {
  before((done) => {
    testDatabase
      .then(() => {
        return User.create({
          _id: userId,
          username: 'Unit Tester',
          password: 'password',
          email: 'unittester@test.fr'
        });
      })
      .then(() => done())
      .catch(err => {
        throw new Error(err);
      })
  });

  describe('Project Creation', () => {
    it('Create a New Project, should be ok', (done) => {
      const project = {
        id: project1Id,
        title: 'Test Project',
        description: 'Test Description',
        dueDate: '31/12/2019',
        projectOwner: userId
      };

      projectRepo
        .createProject(project)
        .then(result => {
          expect(result).to.be.true;
          done();
        });
    });

    it('Create a New Project without Description and Due Date, should be ok', (done) => {
      const project = {
        id: project2Id,
        title: 'Test Project 2',
        projectOwner: userId
      };

      projectRepo
        .createProject(project)
        .then(result => {
          expect(result).to.be.true;
          done();
        });
    });

    it('Create a New Project with Title undefined, should raise an error', (done) => {
      const project = {
        title: undefined,
        projectOwner: userId
      };

      projectRepo
        .createProject(project)
        .catch(err => {
          expect(err).to.be.not.null;
          expect(err.name).to.equal('ValidationError');
          done();
        });
    });
  });

  describe('Project Fetch By Contributor', () => {
    it('Fetching all Projects, should be ok', (done) => {
      projectRepo
        .getProjectsByContributorId(userId)
        .then(projects => {
          expect(projects.length).be.equal(2);
          done();
        });
    });

    it('Fetching all Projects using not contributor User, should be empty', (done) => {
      projectRepo
        .getProjectsByContributorId(fakeUserId)
        .then(projects => {
          expect(projects).be.empty;
          done();
        });
    });
  });

  describe('Project Fetch By Id', () => {
    it('Fetching one existing Project, should be ok', (done) => {
      projectRepo
        .getProjectById(project1Id, userId)
        .then(project => {
          expect(project.id).to.equal(project1Id);
          done();
        });
    });

    it('Fetching one existing Project using not authorized User, should be undefined', (done) => {
      projectRepo
        .getProjectById(project1Id, fakeUserId)
        .then(project => {
          expect(project).to.be.undefined;
          done();
        });
    });

    it('Fetching a non-existing Project, should be undefined', (done) => {
      projectRepo
        .getProjectById(fakeProjectId, userId)
        .then(project => {
          expect(project).to.be.undefined;
          done();
        });
    });
  });

  describe('Project Update', () => {
    it('Update an existing Project, should be ok', (done) => {
      const project = {
        id: project1Id,
        title: 'Test Project MAJ'
      };

      projectRepo
        .updateProject(project, userId)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Update a non-existing Project, should be false success', (done) => {
      const project = {
        id: fakeProjectId,
        title: 'Test Project MAJ'
      };

      projectRepo
        .updateProject(project, userId)
        .then(result => {
          expect(result.success).to.be.false;
          expect(result.error).to.equal('Modification non Autorisée !');
          done();
        });
    });

    it('Update a Project using not authorized User, should be false success', (done) => {
      const project = {
        id: project2Id,
        title: 'Test Project MAJ'
      };

      projectRepo
        .updateProject(project, fakeUserId)
        .then(result => {
          expect(result.success).to.be.false;
          expect(result.error).to.equal('Modification non Autorisée !');
          done();
        });
    });
  });

  describe('Project Delete', () => {
    it('Delete an existing Project, should be ok', (done) => {
      projectRepo
        .deleteProject(project1Id, userId)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Delete a non-existing Project, should be false success', (done) => {
      projectRepo
        .deleteProject(fakeProjectId, userId)
        .then(result => {
          expect(result.success).to.be.false;
          expect(result.errors.error).to.equal('Suppression non Autorisée !');
          done();
        });
    });

    it('Delete a Project using not authorized User, should be false success', (done) => {
      projectRepo
        .deleteProject(project2Id, fakeUserId)
        .then(result => {
          expect(result.success).to.be.false;
          expect(result.errors.error).to.equal('Suppression non Autorisée !');
          done();
        });
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