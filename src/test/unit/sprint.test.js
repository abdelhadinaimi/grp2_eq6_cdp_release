const expect = require('chai').expect;
const mongoose = require('mongoose');

const buildConnection = require('../../config/database.config');
const sprintRepo = require('../../repositories/sprint.repository');
const Project = mongoose.model('Project');
const User = mongoose.model('User');

const fakeUserId1 = '5dbccabe7d93dd0015eac666';
const fakeUserId2 = '5dbccabe7d93dd0015eac667';
const fakeProjectId = '5dbccabe7d93dd0015eac668';
const fakeSprintId = '5dbccabe7d93dd0015eac669';

const buildUser = user => Object.assign({}, {
    username: 'Unit Tester',
    password: 'password',
    email: 'unittester@test.fr'
}, user);

const buildProject = project => Object.assign({}, {
    _id: '5dbccabe7d93dd0015eac668',
    title: 'Test Project',
    description: 'Test Description',
    projectOwner: fakeUserId1,
    sprints: [],
    collaborators: [{
            _id: fakeUserId1,
            userType: "po"
        },
        {
            _id: fakeUserId2,
            userType: "user"
        }
    ]
}, project);

const buildSprint = sprint => Object.assign({}, {
    id: 'id',
    description: 'description',
    startDate: '01/12/2019',
    endDate: '10/12/2019'
}, sprint);

describe('UT Sprint Repository', function() {
    this.timeout(10000);

    before((done) => {
        buildConnection('unit-test')
            .then(() => done())
            .catch(err => {
                throw new Error(err);
            })
    });

    beforeEach(async() => {
        await Project.deleteMany({});
        await User.deleteMany({});
        await User.create(buildUser({ _id: fakeUserId1 }));
        await Project.create(buildProject({ _id: fakeProjectId }));
    });

    describe('Sprint Creation', () => {
        it('Create a new sprint - should be ok', async() => {
            const sprint = buildSprint();
            const result = await sprintRepo.createSprint(fakeProjectId, sprint, fakeUserId1);
            expect(result.success).to.be.true;
        });

        it('Create a new sprint, but a required field is empty - should raise an error', async() => {
            const sprint = {
                id: 'id2',
                description: 'description2',
                startDate: '10/12/2019'
            };
            let result = await sprintRepo.createSprint(fakeProjectId, sprint, fakeUserId1);
            expect(result.success).to.be.true;
        });
    });

    describe('Sprint Update', () => {
        it('Update a sprint - should be ok', async() => {
            const project = await Project.findById(fakeProjectId);
            project.sprints.push(buildSprint());
            await project.save();

            const sprint = {
                id: 'id3',
                description: 'description3'
            };
            const result = await sprintRepo.updateSprint(
                fakeProjectId, {...sprint, _id: project.sprints[0]._id.toString() },
                fakeUserId1
            );
            expect(result.success).to.be.true;
            expect((await Project.findById(fakeProjectId)).sprints[0]).to.contain(sprint);
        });

        it('Update a sprint, but sprint doesn\'t exist - should raise an error', done => {
            sprintRepo.updateSprint(fakeProjectId, buildSprint({ _id: fakeProjectId }), fakeUserId1)
                .then(result => {
                    expect(result.success).to.be.false;
                    done();
                });
        });

        it('Update a sprint, but user is unauthorized - should raise an error', async() => {
            const project = await Project.findById(fakeProjectId);
            project.sprints.push(buildSprint({ _id: fakeSprintId }));
            await project.save();

            const result = await sprintRepo.updateSprint(fakeProjectId, buildSprint(), fakeUserId2);
            expect(result.success).to.be.false;
        });
    });

    describe('Sprint Delete', () => {
        it('Delete a sprint - should be ok', async() => {
            const project = await Project.findById(fakeProjectId);
            project.sprints.push(buildSprint());
            await project.save();

            const result = await sprintRepo.deleteSprint(fakeProjectId, fakeSprintId, fakeUserId1);
            expect(result.success).to.be.true;
        });

        it('Delete a sprint, but sprint doesn\'t exist - should raise an error', done => {
            sprintRepo
                .deleteSprint(fakeProjectId, buildSprint({ _id: fakeProjectId }), fakeUserId1)
                .then(result => {
                    expect(result.success).to.be.false;
                    done();
                });
        });

        it('Delete a sprint, but user is unauthorized - should raise an error', async() => {
            const project = await Project.findById(fakeProjectId);
            project.sprints.push(buildSprint({ _id: fakeSprintId }));
            await project.save();

            const result = await sprintRepo.deleteSprint(fakeProjectId, buildSprint(), fakeUserId2);
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