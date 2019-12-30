const SearchPage = require('../pages/search.po');
const contactFormPage = require('../pages/contact_form.po')
const dbData = require('../fixtures/data_contact')
const dbLanguages= require('../fixtures/languages')
const messages = require('../fixtures/alert_messages')
const chai = require('chai');
const expect = chai.expect;

//***********************************************************************************//
//* VALIDATE CONTACT FORM IN DETAILS PAGE
//***********************************************************************************//
describe('Contact form validation', ()=>{

    const INDEX = 0;

    beforeEach(()=>{
        SearchPage.startURL(dbLanguages.data[INDEX].country_language, dbLanguages.data[INDEX].title);
    })

    it('Filling the form out passing VALID credentials', async()=>{
        var isSuccess = await SearchPage.gotToDetailsPage(INDEX)
                                        .goToContactForm()
                                        .fillForm(dbData.valid_person.name, 
                                                  dbData.valid_person.email, 
                                                  dbData.valid_person.phone, 
                                                  dbData.valid_person.message)
                                        .isSubmitButtonEnabled();

        expect(true, messages.custom_alerts.contact_form.SUBMIT_BUTTON_DISABLED).to.equal(isSuccess);
    })

    it('Filling the form out passing INVALID credentials', async()=>{
        var isSuccess = await SearchPage.gotToDetailsPage(INDEX)
                                        .goToContactForm()
                                        .fillForm(dbData.invalid_person.name, 
                                                  dbData.invalid_person.email, 
                                                  dbData.invalid_person.phone, 
                                                  dbData.invalid_person.message)
                                        .isSubmitButtonEnabled();

        var alerts = await contactFormPage.getAlerts();
        expect(alerts[0]).to.equal(messages.system_alerts.contact_form.REQUIRED_NAME);
        expect(alerts[1]).to.equal(messages.system_alerts.contact_form.INVALID_EMAIL_FORMAT);
        expect(alerts[2]).to.equal(messages.system_alerts.contact_form.INVALID_PHONE_FORMAT);
        expect(alerts[3]).to.equal(messages.system_alerts.contact_form.REQUIRED_MESSAGE);

        expect(false, messages.custom_alerts.contact_form.SUBMIT_BUTTON_ENABLED).to.equal(isSuccess);
    })
})