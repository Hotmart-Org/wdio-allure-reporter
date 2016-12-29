import Allure from 'allure-js-commons';
import Suite from 'allure-js-commons/beans/suite'
import Test from 'allure-js-commons/beans/test'
import Step from 'allure-js-commons/beans/step'

Suite.toXML(){
  this.start = (this.start == "" || typeof this.start === "undefined") ? Date.now() : this.start;
  this.start = (this.stop == "" || typeof this.stop === "undefined") ? Date.now() : this.stop;
  super.toXML();
};

Test.toXML() {
  this.start = (this.start == "" || typeof this.start === "undefined") ? Date.now() : this.start;
  this.stop = (this.stop == "" || typeof this.stop === "undefined") ? Date.now() : this.stop;
  this.status = (this.status == "" || typeof this.status === "undefined") ? "failed" : this.status;
  super.toXML();
};

Step.toXML() {
  this.start = (this.start == "" || typeof this.start === "undefined") ? Date.now() : this.start;
  this.stop = (this.stop == "" || typeof this.stop === "undefined") ? Date.now() : this.stop;
  this.status = (this.status == "" || typeof this.status === "undefined") ? "failed" : this.status;
  super.toXML();
};

class AllureCommon extends Allure {

  setOptions(){
    super.setOptions(options);
  }
  getCurrentSuite(){
    super.getCurrentSuite();
  }
  getCurrentTest(){
    super.getCurrentTest();
  }
  startSuite(){
    super.startSuite(suiteName, timestamp);
  }
  endSuite(){
    super.endSuite(timestamp);
  }
  startCase(){
    super.startCase(testName, timestamp);
  }
  endCase(){
    super.endCase(status, err, timestamp);
  }
  startStep(){
    super.startStep(stepName, timestamp);
  }
  endStep(){
    super.endStep(status, timestamp);
  }
  setDescription(){
    super.setDescription(description, type);
  }
  addAttachment(){
    super.addAttachment(attachmentName, buffer, type);
  }
  pendingCase(){
    super.pendingCase(testName, timestamp);
  }
}

module.exports = AllureCommon;
