const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const userRepo = require("../../repositories/user.repository");
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const user1Id = '5dbccabe7d93dd0015ea3c20';
const user2Id = '5dbccabe7d93dd0015ea3c21';

describe('UT User Repository', () => {
  before((done) => {
    buildConnection('unit-test')
      .then(() => done())
      .catch(err => {
        throw new Error(err);
      })
  });

  describe('User Account Creation', () => {
    it('Create a new user account without problem', (done) => {
      const user = {
        _id: user1Id,
        username: "Unit Tester 1",
        email: "unittester1@test.fr",
        password: "Password1",
        confirmPassword: "Password1"
      };

      userRepo
        .upsertUser(user)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Create a new user account but it already exists, should raise an error', (done) => {
      const user = {
        username: "Unit Tester 1",
        email: "unittester1@test.fr",
        password: "Password1",
        confirmPassword: "Password1"
      };

      userRepo
        .upsertUser(user)
        .then(result => {
          expect(result.success).to.be.false;
          expect(result.errors.length).to.equal(1);
          done();
        });
    });

    it('Create a second user account without problem', (done) => {
      const user = {
        _id: user2Id,
        username: "Unit Tester 2",
        email: "unittester2@test.fr",
        password: "Password2"
      };

      userRepo
        .upsertUser(user)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });
  });

  describe('User Account Update', () => {
    it('Update a user account without problem', (done) => {
      const user = {
        _id: user1Id,
        username: "Unit Tester 1 Edited",
        email: "unittester1@test.fr"
      };

      userRepo
        .upsertUser(user)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Update a user account with an username already used, should be false', (done) => {
      const user = {
        _id: user2Id,
        username: "Unit Tester 1 Edited",
        email: "unittester2@test.fr"
      };

      userRepo
        .upsertUser(user)
        .then(result => {
          expect(result.success).to.be.false;
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
