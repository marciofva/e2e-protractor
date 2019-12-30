'use strict';

const EC = protractor.ExpectedConditions;
const timeout = 30000;

class DetailsPage {

    constructor(){
        this.headlineLabel = element(by.css('div[class="headline-container ng-star-inserted"] > h1'));
        this.addressLabel = element(by.css('div[class="detail-main-address ng-star-inserted"] > p'));
        this.factsListLabel = element.all(by.css('div[class="detail-main-facts ng-star-inserted"] > p'));
        this.availabilityDateLabel = element(by.css('div[class="detail-main-availability"] > p'));
        this.contactBtn = element.all(by.css('button[class="mat-flat-button mat-primary ng-star-inserted"]'));
        this.indentificationLabel = element(by.css('div[class="col-md-6 col-sm-12 unit-facts-desktop"] > app-unit-facts > mat-accordion > h2'));
    }

    async getHeadline(){
        browser.wait(EC.visibilityOf(this.headlineLabel), timeout);
        var headline = await this.headlineLabel.getText();
        return headline;
    }

    async getFullAddress(){
        browser.wait(EC.visibilityOf(this.addressLabel), timeout);
        var address = await this.addressLabel.getText();
        return address.split(/\r?\n/);
    }

    async getDistrict(){
        var district = await this.getFullAddress();

        //Length equals '1' means that there is only address information (No district)
        //Length equals '2' means that there are both district and address
        if (district.length === 1){
            return "";
        }else{
            return district[0];
        }
    }

    async getAddress(){
        var address = await this.getFullAddress();

        //Length equals '1' means that there is only address information (No district)
        //Length equals '2' means that there are both district and address
        if (address.length === 1){
            return address[0];
        }else{
            return address[1];
        }
    }

    async getFactDetails(){
        this.factsListLabel.each((element, index)=>{
            browser.wait(EC.visibilityOf(element), timeout);
        });
        var facts = await this.factsListLabel.getText();
        return facts;
    }

    async getCountOfRoom(){
        var allFacts = await this.getFactDetails();
        var room = allFacts[0];
        return room;
    }

    async getSizeOfApartment(){
        var allFacts = await this.getFactDetails();
        var size = allFacts[1];
        return size;
    }

    async getFloor(){
        var allFacts = await this.getFactDetails();
        var floor = allFacts[2];
        return floor;
    }

    async getPrice(){
        var allFacts = await this.getFactDetails();
        var price = allFacts[3];
        return price;
    }

    async getAvailabilityDate(){
        browser.wait(EC.visibilityOf(this.availabilityDateLabel), timeout);
        var availability = await this.availabilityDateLabel.getText();
        availability = availability.split(" ");
        return availability.pop();
    }

    goToContactForm(){
        this.contactBtn.isDisplayed();
        this.contactBtn.first().click();
        return require('../pages/contact_form.po');
    }

    executeScriptForScrollUP(){
        browser.executeScript('window.scrollTo(0,0);');
        return this;
    }

    async getIdentificationID(){
        var identificationIDTitle = await this.indentificationLabel.getText();
        return identificationIDTitle.split(" ").pop();
    }
}
module.exports = new DetailsPage();