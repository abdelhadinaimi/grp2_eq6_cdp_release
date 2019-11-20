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
  password: "Passw0rd"
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

describe("User Stories", function () {
  this.timeout(3000);
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().setTimeouts({implicit: 5000});
    await driver.manage().window().maximize();
  });

  describe("US#01 Register", () => {
    const url = rootUrl + "/register";

    it("New user", async () => {
      driver.get(url);

      await driver.findElement(By.id("username")).sendKeys(user.username);
      await driver.findElement(By.id("email")).sendKeys(user.email);
      await driver.findElement(By.id("password")).sendKeys(user.password);
      await driver.findElement(By.id("confirmPassword")).sendKeys(user.password, Key.ENTER);
      const toast = await driver.findElement(By.css(".toast"));
      const text = await toast.getText();

      assert(text === "Compte créé avec succès !");
    });

    it("New user with non-conform username & password and not same password confirmation", async () => {
      driver.get(url);

      await driver.findElement(By.id("username")).sendKeys("aze");
      await driver.findElement(By.id("email")).sendKeys(user.email);
      await driver.findElement(By.id("password")).sendKeys("azertyuio");
      await driver.findElement(By.id("confirmPassword")).sendKeys(user.password, Key.ENTER);
      const spanUsername = await driver.findElement(By.css("input#username ~ span.helper-text"));
      const spanPassword = await driver.findElement(By.css("input#password ~ span.helper-text"));
      const spanConfirmPassword = await driver.findElement(By.css("input#confirmPassword ~ span.helper-text"));
      const textUsername = await spanUsername.getAttribute("data-error");
      const textPassword = await spanPassword.getAttribute("data-error");
      const textConfirmPassword = await spanConfirmPassword.getAttribute("data-error");

      assert(textUsername === errorUserMessages.username.min);
      assert(textPassword === errorUserMessages.password.number);
      assert(textConfirmPassword === errorUserMessages.confirmPassword.same);
    });
  });

  describe("US#02 Login", () => {

  });

  describe("US#04 Update Account", () => {

  });

  describe("US#06 Create Project", () => {

  });

  describe("US#08 Update Project", () => {

  });

  describe("US#09 Delete Project", () => {

  });

  describe("US#10 Invite Contributor", () => {

  });

  describe("US#11 Role Contributor", () => {

  });

  describe("US#12 Delete Contributor", () => {

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

  });

  after(done => {
    driver
      .quit()
      .then(() => buildConnection("cdp"))
      .then(() => User.deleteOne({username: user.username}))
      .then(() => User.deleteOne({username: user.usernameUpdate}))
      .then(() => Project.deleteOne({title: firstProject.title}))
      .then(() => Project.deleteOne({title: firstProject.titleUpdate}))
      .then(() => Project.deleteOne({title: secondProject.title}))
      .then(() => mongoose.disconnect())
      .then(() => done());
  });
});
