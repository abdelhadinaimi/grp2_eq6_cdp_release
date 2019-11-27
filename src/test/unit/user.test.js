const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const userRepo = require("../../repositories/user.repository");
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const user1 = {
  _id: '5dbccabe7d93dd0015ea3c20',
  username: "Unit Tester 1",
  email: "unittester1@test.fr",
  password: "Password1"
};

const user2 = {
  _id: "5dbccabe7d93dd0015ea3c21",
  username: "Unit Tester 2",
  email: "unittester2@test.fr",
  password: "Password2"
};

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
      userRepo
        .upsertUser(user1)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Create a new user account but it already exists, should raise an error', (done) => {
      const sameUser1 = {
        username: user1.username,
        email: user1.email,
        password: user1.password
      };

      userRepo
        .upsertUser(sameUser1)
        .then(result => {
          expect(result.success).to.be.false;
          done();
        });
    });

    it('Create a second user account without problem', (done) => {
      userRepo
        .upsertUser(user2)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });
  });

  describe('User Account Update', () => {
    it('Update a user account without problem', (done) => {
      user1.username = "Unit Tester 1 Edited";

      userRepo
        .upsertUser(user1)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    it('Update a user account with an username already used, should be false', (done) => {
      user2.username = "Unit Tester 1 Edited";

      userRepo
        .upsertUser(user2)
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
