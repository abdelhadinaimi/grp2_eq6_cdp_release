const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const userRepo = require("../../repositories/user.repository");
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const userId = '5dbccabe7d93dd0015eac669';

describe('UT Project Repository', () => {
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
        username: "Unit Tester 1",
        email: "unittester1@test.fr",
        password: "Password1",
        confirmPassword: "Password1"
      };

      userRepo
        .createUser(user)
        .then(result => {
          expect(result.success).to.be.true;
          done();
        });
    });

    /*
    it('Create a new user account with different passwords, should raise an error', (done) => {
      const user = {
        username: "Unit Tester 2",
        email: "unittester2@test.fr",
        password: "Password1",
        confirmPassword: "Password2"
      };

      userRepo
        .createUser(user)
        .catch(err => {
          expect(err).to.be.not.null;
          expect(err.name).to.equal('ValidationError');
          done();
        });
    });

    it('Create a new user account with invalid password, should raise an error', (done) => {
      const user = {
        username: "Unit Tester 3",
        email: "unittester3@test.fr",
        password: "password",
        confirmPassword: "password"
      };

      userRepo
        .createUser(user)
        .catch(err => {
          expect(err).to.be.not.null;
          expect(err.name).to.equal('ValidationError');
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
        .createUser(user)
        .catch(err => {
          expect(err).to.be.not.null;
          expect(err.name).to.equal('ValidationError');
          done();
        });
    });
    */
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