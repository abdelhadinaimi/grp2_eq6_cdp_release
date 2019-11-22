const {Builder, By, Key, until} = require("selenium-webdriver");
const assert = require("assert");

const mongoose = require("mongoose");
const buildConnection = require("../../config/database.config");
const User = mongoose.model("User");
const Project = mongoose.model("Project");

const {errorUserMessages} = require("../../util/constants");

const rootUrl = "http://localhost:8080";

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

  },
  task: {

  }
};

const cssSelectors = {
  greenText: ".green-text",
  toast: ".toast",
  addContributor: ".btn-floating > .material-icons",
  helpers : {
    username: "input#username ~ span.helper-text",
    email: "input#email ~ span.helper-text",
    password: "input#password ~ span.helper-text",
    confirmPassword: "input#confirmPassword ~ span.helper-text"
  }
};

const attributes = {
  dataError: "data-error",
  value: "value"
};

describe("User Stories",  function () {
  this.timeout(3000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();

    await buildConnection('cdp');
    await User.create({username: user2.username, email: user2.email, password: user2.password});
  });

  describe("US#01 Register", () => {
    const url = rootUrl + "/register";

    it("New user", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.user.username)).sendKeys(user.username);
      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password);
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.password, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Compte créé avec succès !");
    });

    it("New user with same credentials as first", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.user.username)).sendKeys(user.username);
      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password);
      await driver.findElement(By.id(fields.user.confirmPassword)).sendKeys(user.password, Key.ENTER);
      const span = await driver.findElement(By.css(cssSelectors.helpers.username));
      const text = await span.getAttribute(attributes.dataError);

      assert(text === errorUserMessages.username.exists);
    });

    it("New user with non-conform username & password and not same password confirmation", async () => {
      driver.get(url);

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
      driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys("notanemail@sel.fr");
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password, Key.ENTER);
      const spanEmail = await driver.findElement(By.css(cssSelectors.helpers.email));
      const textEmail = await spanEmail.getAttribute(attributes.dataError);

      assert(textEmail === errorUserMessages.user.not_found);
    });

    it("Login with bad password", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys("Bad Passw0rd", Key.ENTER);
      const spanPassword = await driver.findElement(By.css(cssSelectors.helpers.password));
      const textPassword = await spanPassword.getAttribute(attributes.dataError);

      assert(textPassword === errorUserMessages.password.incorrect);
    });

    it("Login success", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.user.email)).sendKeys(user.email);
      await driver.findElement(By.id(fields.user.password)).sendKeys(user.password, Key.ENTER);
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Bienvenue " + user.username + " !");
    });
  });

  describe("US#04 Update Account", () => {
    const url = rootUrl + "/account";

    it("Update username & password", async () => {
      driver.get(url);

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
      driver.get(url);

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

  describe("US#06 Create Project", () => {
    const url = rootUrl + "/projects/add";

    it("First Project", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.project.title)).sendKeys(firstProject.title);
      await driver.findElement(By.id(fields.project.dueDate)).sendKeys(firstProject.dueDate);
      await driver.findElement(By.id(fields.project.description)).sendKeys(firstProject.description);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet créé avec succès !");

      const deleteButton = await driver.findElement(By.css("a.deleteButton"));
      firstProject.id = await deleteButton.getAttribute("_id");
    });

    it("Project without due date & description", async () => {
      driver.get(url);

      await driver.findElement(By.id(fields.project.title)).sendKeys(secondProject.title);
      await driver.findElement(By.css(cssSelectors.greenText)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet créé avec succès !");
    });
  });

  describe("US#08 Update Project", () => {
    it("Update first project", async () => {
      driver.get(rootUrl + "/projects/" + firstProject.id + "/edit");

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
      driver.get(rootUrl);

      await driver.findElement(By.css("li:nth-child(2) > .collapsible-header")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css(".active .row:nth-child(3) > .btn"))), 3000);
      await driver.findElement(By.css(".active .row:nth-child(3) > .btn")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css(".btn-flat:nth-child(2)"))), 3000);
      await driver.findElement(By.css(".btn-flat:nth-child(2)")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Projet supprimé avec succès !");
    });
  });

  describe("US#10 Invite Contributor", () => {
    const url = (projectId) => rootUrl + "/projects/" + projectId;

    it("Invite an existing contributor", async () => {
      driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.id(fields.project.contributor))), 3000);
      await driver.findElement(By.id(fields.project.contributor)).sendKeys(user.email);
      await driver.findElement(By.id(fields.project.inviteButton)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Ce contributeur a déjà été ajouté !");
    });

    it("Invite a non-existing user", async () => {
      driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.id(fields.project.contributor))), 3000);
      await driver.findElement(By.id(fields.project.contributor)).sendKeys("nonexistinguser@mail.fr");
      await driver.findElement(By.id(fields.project.inviteButton)).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Aucun compte trouvé...");
    });

    it("Invite a new contributor", async () => {
      driver.get(url(firstProject.id));

      await driver.findElement(By.css(cssSelectors.addContributor)).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.id(fields.project.contributor))), 3000);
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
      driver.get(rootUrl + "/projects/" + firstProject.id);

      await driver.findElement(By.css("input.select-dropdown")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("li > span"))), 3000);
      await driver.findElement(By.css("li > span")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Rôle mis à jour !");
    });
  });

  describe("US#12 Delete Contributor", () => {
    it("Delete a contributor", async () => {
      driver.get(rootUrl + "/projects/" + firstProject.id);

      await driver.findElement(By.css("td > .deleteButton")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("form.deleteContrForm > div.modal-footer > button.red-text"))), 3000);
      await driver.findElement(By.css("form.deleteContrForm > div.modal-footer > button.red-text")).click();
      const toast = await driver.findElement(By.css(cssSelectors.toast));
      const text = await toast.getText();

      assert(text === "Contributeur supprimé !");
    });
  });

  describe("US#15 Create Issue", () => {

  });

  describe("US#16 Update Issue", () => {

  });

  describe("US#17 Delete Issue", () => {

  });

  describe("US#20 Create Task", () => {

  });

  describe("US#21 Update Task", () => {

  });

  describe("US#22 Delete Task", () => {

  });

  describe("US#03 Logout", () => {
    it("Logout", async function () {
      await driver.get(rootUrl);
      await driver.findElement(By.css("a.dropdown-trigger")).click();
      await driver.wait(until.elementIsVisible(driver.findElement(By.css("a.red-text.text-lighten-3"))), 3000);
      await driver.findElement(By.css("a.red-text.text-lighten-3")).click();
      const url = await driver.getCurrentUrl();

      assert(url === "http://localhost:8080/");
    });
  });

  after(done => {
    driver
      .quit()
      .then(() => User.deleteOne({username: user.usernameUpdate}))
      .then(() => User.deleteOne({username: user2.username}))
      .then(() => Project.deleteOne({title: firstProject.titleUpdate}))
      .then(() => Project.deleteOne({title: secondProject.title}))
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});
