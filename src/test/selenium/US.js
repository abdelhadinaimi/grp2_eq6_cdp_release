const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require("assert");

const mongoose = require("mongoose");
const buildConnection = require("../../config/database.config");
const User = mongoose.model("User");
const Project = mongoose.model("Project");

const bcrypt = require('bcryptjs');

const {errorUserMessages, errorIssueMessages} = require("../../util/constants");

const user = {
  username: "selenium",
  usernameUpdate: "seleniumUpd",
  email: "selenium@mail.fr",
  password: "Passw0rd",
  passwordUpdate: "New Passw0rd"
};

const user2 = {
  username: "selenium2",
  email: "selenium2@mail.fr",
  password: "Passw0rd2"
};

const firstProject = {
  id: null,
  title: "Mon Premier Projet",
  titleUpdate: "Mon Premier Projet MAJ",
  description: "Une description !",
  dueDate: "31/12/2019"
};

const secondProject = {
  title: "Second Projet"
};

const firstIssue = {
  id: null,
  storyId: "US#01",
  userType: "Utilisateur",
  userGoal: "Saisir mes identifiants",
  userGoalUpd: "Saisir mon email et mon mot de passe",
  userReason: "Me connecter",
  testLink: "https://test.fr/sprint"
};

const secondIssue = {
  storyId: "US#02",
  userType: "Utilisateur",
  userGoal: "Rentrer un email",
  userReason: "Générer un nouveau mot de passe"
};

const firstTask = {
  _id: null,
  description: "task1",
  definitionOfDone: "definition Of Done",
  testLink: "https://test.fr/task"
};

const secondTask = {
  description: "task2",
  testLink: "https://google.com",
  definitionOfDone: "definition Of Done"
};

const firstSprint = {
  _id: null,
  id: "Sprint 1",
  idUpd: "Sprint 1.1",
  startDate: "10/12/2019",
  endDate: "17/12/2019",
  description: "Le sprint 1 !!!"
};

const secondSprint = {
  id: "Sprint 2",
  startDate: "20/12/2019",
  endDate: "17/12/2019",
  description: "Le sprint 2 !!!!"
};

const firstRelease = {
  id: null,
  version: "v1.0",
  versionUpd: "v1.1",
  description: "Description de la première release",
  downloadLink: "https://realease.fr/v1.0.zip",
  docLink: "https://doc.fr/v1.0.zip"
};

const fields = {
  user: {
    username: "username",
    email: "email",
    password: "password",
    confirmPassword: "confirmPassword"
  },
  project: {
    title: "title",
    description: "description",
    dueDate: "dueDate",
    contributor: "email",
    inviteButton: "inviteButton"
  },
  issue: {
    storyId: "storyId",
    userType: "userType",
    userGoal: "userGoal",
    userReason: "userReason",
    testLink: "testLink"
  },
  sprint: {
    id: "id",
    startDate: "startDate",
    endDate: "endDate",
    description: "description"
  },
  task: {
    description: "description",
    cost: "cost",
    testLink: "testLink",
    definitionOfDone: "definitionOfDone"
  },
  release: {
    version: "version",
    description: "description",
    downloadLink: "downloadLink",
    docLink: "docLink"
  }
};

const cssSelectors = {
  greenText: ".green-text",
  toast: ".toast",
  addContributor: ".btn-floating > .material-icons",
  deleteButton: "a.deleteButton",
  helpers : {
    username: "input#username ~ span.helper-text",
    email: "input#email ~ span.helper-text",
    password: "input#password ~ span.helper-text",
    confirmPassword: "input#confirmPassword ~ span.helper-text",
    storyId: "input#storyId ~ span.helper-text"
  }
};

const attributes = {
  dataError: "data-error",
  value: "value"
};

const HOST_SRV = process.env.HOST_SRV || "localhost";
const PORT_SRV = process.env.PORT_SRV || "4444";
const rootUrl = "http://api:8080";
const servUrl = `http://${HOST_SRV}:${PORT_SRV}/wd/hub`;

const removeInDB = async () => {
  await User.deleteOne({username: user.username});
  await User.deleteOne({username: user.usernameUpdate});
  await User.deleteOne({username: user2.username});
  await Project.deleteOne({title: firstProject.title});
  await Project.deleteOne({title: firstProject.titleUpdate});
  await Project.deleteOne({title: secondProject.title});
};

describe("User Stories",  function () {
  this.timeout(10000);
  let driver;

  before(async function() {
    driver = await new Builder().forBrowser("chrome").usingServer(servUrl).build();
    driver.manage().setTimeouts( { implicit: 10000, pageLoad: 10000, script: 10000 } );

    await buildConnection('cdp');
    await removeInDB();
    const salt = await bcrypt.genSaltSync(8);
    const pass = await bcrypt.hashSync(user2.password, salt);
    await User.create({username: user2.username, email: user2.email, password: pass});
  });

  describe("US#01 Register", () => {
    const url = rootUrl + "/register";

    it("New user", async function() {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.username)).sendKeys(user.username);
      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password);
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.password, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Compte créé avec succès !");
    });

    it("New user with same credentials as first", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.username)).sendKeys(user.username);
      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password);
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.password, Key.ENTER);
      const span = await driver.findElement(By.css(cssSelectors.helpers.username));
      const text = await span.getAttribute(attributes.dataError);

      assert(text === errorUserMessages.username.exists);
    });

    it("New user with non-conform username & password and not same password confirmation", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.username)).sendKeys("aze");
      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys("azertyuio");
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.password, Key.ENTER);
      const spanUsername = await driver.findElement(By.css(cssSelectors.helpers.username));
      const spanPassword = await driver.findElement(By.css(cssSelectors.helpers.password));
      const spanConfirmPassword = await driver.findElement(By.css(cssSelectors.helpers.confirmPassword));
      const textUsername = await spanUsername.getAttribute(attributes.dataError);
      const textPassword = await spanPassword.getAttribute(attributes.dataError);
      const textConfirmPassword = await spanConfirmPassword.getAttribute(attributes.dataError);

      assert(textUsername === errorUserMessages.username.min);
      assert(textPassword === errorUserMessages.password.number);
      assert(textConfirmPassword === errorUserMessages.confirmPassword.same);
    });
  });

  describe("US#02 Login", () => {
    const url = rootUrl + "/login";

    it("Login with non-existing email", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys("notanemail@sel.fr");
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password, Key.ENTER);
      const spanEmail = await driver.findElement(By.css(cssSelectors.helpers.email));
      const textEmail = await spanEmail.getAttribute(attributes.dataError);

      assert(textEmail === errorUserMessages.user.not_found);
    });

    it("Login with bad password", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys("Bad Passw0rd", Key.ENTER);
      const spanPassword = await driver.findElement(By.css(cssSelectors.helpers.password));
      const textPassword = await spanPassword.getAttribute(attributes.dataError);

      assert(textPassword === errorUserMessages.password.incorrect);
    });

    it("Login success", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Bienvenue " + user.username + " !");
    });
  });

  // US#03 testée après l'US#43

  describe("US#04 Update Account", () => {
    const url = rootUrl + "/account";

    it("Update username & password", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.username)).clear();
      await driver.findElement(By.id(fields.user.username)).sendKeys(user.usernameUpdate);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.passwordUpdate);
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.passwordUpdate, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const input = await driver.findElement(By.id(fields.user.username));
      const text = await toast.getText();
      const value = await input.getAttribute(attributes.value);

      assert(text === "Vos modifications ont bien été prises en compte !");
      assert(value === user.usernameUpdate);
    });

    it("Update with invalid password and not same confirm password", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.user.password)).sendKeys("azertyuiop");
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys("Bad Passw0rd", Key.ENTER);
      const spanPassword = await driver.findElement(By.css(cssSelectors.helpers.password));
      const spanConfirmPassword = await driver.findElement(By.css(cssSelectors.helpers.confirmPassword));
      const textPassword = await spanPassword.getAttribute(attributes.dataError);
      const textConfirmPassword = await spanConfirmPassword.getAttribute(attributes.dataError);

      assert(textPassword === errorUserMessages.password.number);
      assert(textConfirmPassword === errorUserMessages.confirmPassword.same);
    });
  });

  // US#05 testée après l'US#06

  describe("US#06 Create Project", () => {
    const url = rootUrl + "/projects/add";

    it("First Project", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.project.title)).sendKeys(firstProject.title);
      await driver.findElement(By.id(fields.project.dueDate)).sendKeys(firstProject.dueDate);
      await driver.findElement(By.id(fields.project.description)).sendKeys(firstProject.description);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet créé avec succès !");

      const deleteButton = await driver.findElement(By.css(cssSelectors.deleteButton));
      firstProject.id = await deleteButton.getAttribute("_id");
    });

    it("Project without due date & description", async () => {
      await driver.get(url);

      await driver.findElement(By.id(fields.project.title)).sendKeys(secondProject.title);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet créé avec succès !");
    });
  });

  describe("US#05 Home page", () => {
    it("See my projects on homepage", async () => {
      await driver.get(rootUrl);

      const div = await driver.findElement(By.css("div.collapsible-header.center-align"));
      const text = await div.getText();

      assert(text === firstProject.title);
    });
  });

  describe("US#07 Consult Project", () => {
    it("See a project homepage", async () => {
      await driver.get(rootUrl);

      await driver.findElement(By.css("div.collapsible-header.center-align")).click();
      await driver.findElement(By.css(".active .row:nth-child(1) > .btn")).click();
      const h1 = await driver.findElement(By.css("h1.left-align.white-text"));
      const text = await h1.getText();

      assert(text === firstProject.title);
    });
  });

  describe("US#08 Update Project", () => {
    it("Update first project", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/edit");

      await driver.findElement(By.id(fields.project.title)).clear();
      await driver.findElement(By.id(fields.project.title)).sendKeys(firstProject.titleUpdate, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const title = await driver.findElement(By.css("h1.left-align.white-text"));
      const text = await toast.getText();
      const value = await title.getText();

      assert(text === "Projet mis à jour !");
      assert(value === firstProject.titleUpdate);
    });
  });

  describe("US#09 Delete Project", () => {
    it("Delete second Project", async () => {
      await driver.get(rootUrl);

      await driver.findElement(By.css("li:nth-child(2) > .collapsible-header")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("li:nth-child(2) div.hide-on-small-only a.deleteButton"))), 10000);
      await driver.findElement(By.css("li:nth-child(2) div.hide-on-small-only a.deleteButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("button.btn-flat.red-text"))), 10000);
      await driver.findElement(By.css("button.btn-flat.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet supprimé avec succès !");
    });
  });

  describe("US#10 Invite Contributor", () => {
    const url = (projectId) => rootUrl + "/projects/" + projectId;

    it("Invite an existing contributor", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.findElement(By.id(fields.project.contributor)).sendKeys(user.email);
      await driver.findElement(By.id(fields.project.inviteButton)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Ce contributeur a déjà été ajouté !");
    });

    it("Invite a non-existing user", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.findElement(By.id(fields.project.contributor)).sendKeys("nonexistinguser@mail.fr");
      await driver.findElement(By.id(fields.project.inviteButton)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Aucun compte trouvé...");
    });

    it("Invite a new contributor", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.findElement(By.id(fields.project.contributor)).sendKeys(user2.email);
      await driver.findElement(By.id(fields.project.inviteButton)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Invitation envoyée !");

      const project = await Project.findById(firstProject.id);
      project.collaborators.forEach(col => col.activated = true);
      await project.save();
    });
  });

  describe("US#11 Role Contributor", () => {
    it("Assign Project Manager Role", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id);

      await driver.findElement(By.css("input.select-dropdown")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("ul > li:nth-child(1) > span"))), 10000);
      await driver.findElement(By.css("ul > li:nth-child(1) > span")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Rôle mis à jour !");
    });
  });

  describe("US#12 Delete Contributor", () => {
    const url = projectId => rootUrl + "/projects/" + projectId;

    it("Delete a contributor", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.css("td > a.deleteButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("form.deleteContrForm > div.modal-footer > button.red-text"))), 10000);
      await driver.findElement(By.css("form.deleteContrForm > div.modal-footer > button.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Contributeur supprimé !");
    });

    it("Add back the contributor", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.findElement(By.id(fields.project.contributor)).sendKeys(user2.email);
      await driver.findElement(By.id(fields.project.inviteButton)).click();
    });
  });

  // US#13 et US#14 testée après l'US#03

  describe("US#15 Create Issue", () => {
    const url = (projectId) => rootUrl + "/projects/" + projectId + "/issues/add";

    it("First issue", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.id(fields.issue.storyId)).sendKeys(firstIssue.storyId);
      await driver.findElement(By.id(fields.issue.userType)).sendKeys(firstIssue.userType);
      await driver.findElement(By.id(fields.issue.userGoal)).sendKeys(firstIssue.userGoal);
      await driver.findElement(By.id(fields.issue.userReason)).sendKeys(firstIssue.userReason);
      await driver.findElement(By.id(fields.issue.testLink)).sendKeys(firstIssue.testLink);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Issue créée avec succès !");

      const deleteButton = await driver.findElement(By.css(cssSelectors.deleteButton));
      firstIssue.id = await deleteButton.getAttribute("_id");
    });

    it("Same id than the first one", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.id(fields.issue.storyId)).sendKeys(firstIssue.storyId);
      await driver.findElement(By.id(fields.issue.userType)).sendKeys(firstIssue.userType);
      await driver.findElement(By.id(fields.issue.userGoal)).sendKeys(firstIssue.userGoal);
      await driver.findElement(By.id(fields.issue.userReason)).sendKeys(firstIssue.userReason);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const spanStoryId = await driver.findElement(By.css(cssSelectors.helpers.storyId));
      const textStoryId = await spanStoryId.getAttribute(attributes.dataError);

      assert(textStoryId === errorIssueMessages.storyId.unique);
    });

    it("Second issue", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.id(fields.issue.storyId)).sendKeys(secondIssue.storyId);
      await driver.findElement(By.id(fields.issue.userType)).sendKeys(secondIssue.userType);
      await driver.findElement(By.id(fields.issue.userGoal)).sendKeys(secondIssue.userGoal);
      await driver.findElement(By.id(fields.issue.userReason)).sendKeys(secondIssue.userReason);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Issue créée avec succès !");
    });
  });

  describe("US#16 Update Issue", () => {
    it("Update first issue", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/issues/" + firstIssue.id + "/edit");

      await driver.findElement(By.id(fields.issue.userGoal)).clear();
      await driver.findElement(By.id(fields.issue.userGoal)).sendKeys(firstIssue.userGoalUpd);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Issue mise à jour !");
    })
  });

  // US#17 testée après l'US#18

  describe("US#18 View Issues", () => {
    it("Consult issues", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/issues");

      const lis = await driver.findElements(By.css("ul.collapsible > li"));

      assert(lis.length === 3);
    })
  });

  describe("US#17 Delete Issue", () => {
  it("Delete the second issue", async () => {
    await driver.get(rootUrl + "/projects/" + firstProject.id + "/issues");

    await driver.findElement(By.css("li:nth-child(3) > .collapsible-header")).click();
    await driver.wait(until.elementIsVisible(driver.findElement(By.css("li.active a.btn.deleteButton"))), 10000);
    await driver.findElement(By.css("li.active a.btn.deleteButton")).click();
    await driver.wait(until.elementIsVisible(driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text"))), 10000);
    await driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text")).click();
    const toast = await driver.findElement(By.css(cssSelectors.toast));
    const text = await toast.getText();

    assert(text === "Issue supprimée avec succès !");
  })
});

  describe("US#19 Consult one Issue", () => {
    it("Consult first issue's information", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/issues");

      await driver.findElement(By.css("ul.collapsible > li:nth-child(2)")).click();
      const us = await driver.findElement(By.css("li.active > div.collapsible-body > div:nth-child(2) > div.col.s12.m9.l10 > div > div:nth-child(1) > div"));
      const text = await us.getAttribute("innerHTML");

      assert(text.includes(firstIssue.userType));
      assert(text.includes(firstIssue.userGoal) || text.includes(firstIssue.userGoalUpd));
      assert(text.includes(firstIssue.userReason));
    })
  });

  // US#20 à US#28 après US#33

  describe("US#29 Create Sprint", () => {
    const url = (projectId) => rootUrl + "/projects/" + projectId + "/sprints/add";

    it("First Sprint", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.id(fields.sprint.id)).sendKeys(firstSprint.id);
      await driver.findElement(By.id(fields.sprint.startDate)).sendKeys(firstSprint.startDate);
      await driver.findElement(By.id(fields.sprint.endDate)).sendKeys(firstSprint.endDate);
      await driver.findElement(By.id(fields.sprint.description)).sendKeys(firstSprint.description);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Sprint créé avec succès !");

      const deleteButton = await driver.findElement(By.css(cssSelectors.deleteButton));
      firstSprint._id = await deleteButton.getAttribute("_id");
    });

    it("Second Sprint", async () => {
      await driver.get(url(firstProject.id));

      await driver.findElement(By.id(fields.sprint.id)).sendKeys(secondSprint.id);
      await driver.findElement(By.id(fields.sprint.startDate)).sendKeys(secondSprint.startDate);
      await driver.findElement(By.id(fields.sprint.endDate)).sendKeys(secondSprint.endDate);
      await driver.findElement(By.id(fields.sprint.description)).sendKeys(secondSprint.description);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Sprint créé avec succès !");
    });
  });

  describe("US#30 Update Sprint", () => {
    it("Update first sprint", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints/" + firstSprint._id + "/edit");

      await driver.findElement(By.id(fields.sprint.id)).clear();
      await driver.findElement(By.id(fields.sprint.id)).sendKeys(firstSprint.idUpd);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Sprint mis à jour !");
    })
  });

  // US#31 après US#32

  describe("US#32 View Sprints", () => {
    it("Consult sprints", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints");

      const lis = await driver.findElements(By.css("ul.collapsible > li"));

      assert(lis.length === 3);
    })
  });

  describe("US#31 Delete Sprint", () => {
    it("Delete the second sprint", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints");

      await driver.findElement(By.css("li:nth-child(3) > .collapsible-header")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("li.active a.btn.deleteButton"))), 10000);
      await driver.findElement(By.css("li.active a.btn.deleteButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text"))), 10000);
      await driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Sprint supprimé avec succès !");
    })
  });

  describe("US#33 Consult one Sprint", () => {
    it("Consult first sprint's information", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints");

      await driver.findElement(By.css("li:nth-child(2) > .collapsible-header")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("li.active a.btn.blue"))), 10000);
      await driver.findElement(By.css("li.active a.btn.blue")).click();

      const sprintId = await (await driver.findElement(By.css("#sprintId"))).getText();
      assert(sprintId === firstSprint.id || sprintId === firstSprint.idUpd);
    })
  });

  describe("US#20 / US#34 Create Task", () => {
    it("First task", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints/" + firstSprint._id + "/tasks/add");

      await driver.findElement(By.id(fields.task.cost)).sendKeys(Key.ARROW_UP, Key.ARROW_UP, Key.ARROW_UP);
      await driver.findElement(By.id(fields.task.definitionOfDone)).sendKeys(firstTask.definitionOfDone);
      await driver.findElement(By.id(fields.task.description)).sendKeys(firstTask.description);
      await driver.findElement(By.id(fields.task.testLink)).sendKeys(firstTask.testLink);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Tâche créée avec succès !");

      const deleteButton = await driver.findElement(By.css(cssSelectors.deleteButton));
      firstTask._id = await deleteButton.getAttribute("_id");
    });
    
    it("Second task", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints/" + firstSprint._id + "/tasks/add");

      await driver.findElement(By.id(fields.task.definitionOfDone)).sendKeys(secondTask.definitionOfDone);
      await driver.findElement(By.id(fields.task.description)).sendKeys(secondTask.description);
      await driver.findElement(By.id(fields.task.testLink)).sendKeys(secondTask.testLink);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Tâche créée avec succès !");
    });
  });

  describe("US#25 / US#42 Consult Task", () => {
    it("Task cost shown in red if cost higher than 2 days", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/sprints/" + firstSprint._id);

      const elem = await driver.findElement(By.css(`li[id='${firstTask._id}'] .red-text`));
      const text = await elem.getText();

      assert(text === "2 j/h");
    });
  });

  describe("US#21 / US#35 Update Task", () => {

  });

  // US#22 testée après l'US#23

  describe("US#23 View Tasks", () => {

  });

  describe("US#22 Delete Task", () => {

  });

  describe("US#24 View my Tasks", () => {

  });

  describe("US#26 Link issue to Task", () => {

  });

  describe("US#27 Assign user to Task", () => {

  });

  describe("US#28 Update state to Task", () => {

  });

  describe("US#36 Add Release", () => {
    it("Add first release", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/releases/add");

      await driver.findElement(By.id(fields.release.version)).sendKeys(firstRelease.version);
      await driver.findElement(By.id(fields.release.description)).sendKeys(firstRelease.description);
      await driver.findElement(By.id(fields.release.downloadLink)).sendKeys(firstRelease.downloadLink);
      await driver.findElement(By.id(fields.release.docLink)).sendKeys(firstRelease.docLink);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Release créée avec succès !");

      const deleteButton = await driver.findElement(By.css(cssSelectors.deleteButton));
      firstRelease.id = await deleteButton.getAttribute("_id");
    });
  });

  describe("US#37 View Releases", () => {
    it("View all releases", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/releases");

      const lis = await driver.findElements(By.css("ul.collapsible > li"));

      assert(lis.length === 2);
    });
  });

  describe("US#38 View Tests", () => {

  });

  // US#39 à US#41 non testées puisqu'il faut uploader un fichier

  describe("US#43 View burndown chart", () => {

  });

  describe("US#44 Update Release", () => {
    it("Update the first release", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/releases/" + firstRelease.id + "/edit");

      await driver.findElement(By.id(fields.release.version)).clear();
      await driver.findElement(By.id(fields.release.version)).sendKeys(firstRelease.versionUpd);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Release mise à jour !");
    });
  });

  describe("US#45 Delete Release", () => {
    it("Delete the first release", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/releases");

      await driver.findElement(By.css("li:nth-child(2) > .collapsible-header")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("li.active a.btn.deleteButton"))), 10000);
      await driver.findElement(By.css("li.active a.btn.deleteButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text"))), 10000);
      await driver.findElement(By.css("form.deleteForm > div.modal-footer > button.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Release supprimée avec succès !");
    });
  });

  describe("US#03 Logout", () => {
    it("Logout", async function () {
      await driver.get(rootUrl);

      await driver.findElement(By.css("a.dropdown-trigger")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("a.red-text.text-lighten-3"))), 10000);
      await driver.findElement(By.css("a.red-text.text-lighten-3")).click();
      const url = await driver.getCurrentUrl();

      assert(url === rootUrl + "/");
    });
  });

  describe("US#13 Accept Invitation", () => {
    it("Test link received by email", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id + "/invite");

      await driver.findElement(By.id(fields.user.email)).sendKeys(user2.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user2.password, Key.ENTER);

      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Invitation Acceptée !");
    });
  });

  describe("US#14 Leave Project", () => {
    it("Leave the project", async () => {
      await driver.get(rootUrl + "/projects/" + firstProject.id);

      await driver.findElement(By.css("a.quitButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("button.red-text"))), 10000);
      await driver.findElement(By.css("button.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Vous avez quitté le projet !");
    });
  });

  after(async function() {
    await driver.quit();
    await removeInDB();
    await mongoose.disconnect();
  });
});
