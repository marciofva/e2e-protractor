'use strict';

const EC = protractor.ExpectedConditions;
const timeout = 30000;

class contactFormPage {

    constructor(){
        this.nameField = element(by.css('input[name="name"]'));
        this.emailField = element(by.css('input[name="email"]'));
        this.phoneField = element(by.css('input[name="phone"]'));
        this.messageTxtArea= element(by.css('textarea[name="message"]'));
        this.submitButton= element(by.css('button[type="submit"]'));
        this.alertErrors = element.all(by.css('mat-error[id^="mat-error-"]'));
    }

    fillForm(name, email, phone, message){
        this.inputName(name);
        this.inputEmail(email);
        this.inputPhone(phone);
        this.inputMessage(message);
        return this;
    }

    inputName(name){
        browser.wait(EC.visibilityOf(this.nameField), timeout);
        this.nameField.click();
        this.nameField.sendKeys(name);
    }

    inputEmail(email){
        browser.wait(EC.visibilityOf(this.emailField), timeout);
        this.emailField.sendKeys(email);
    }

    inputPhone(phone){
        browser.wait(EC.visibilityOf(this.phoneField), timeout);
        this.phoneField.sendKeys(phone);
    }

    inputMessage(message){
        browser.wait(EC.visibilityOf(this.messageTxtArea), timeout);
        this.messageTxtArea.sendKeys(message);
        this.phoneField.click();
    }

    async isSubmitButtonEnabled(){
        return await this.submitButton.isEnabled();
    }

    async getAlerts(){
        return await this.alertErrors.getText();
    }
}
module.exports = new contactFormPage();