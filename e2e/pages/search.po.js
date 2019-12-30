'use strict';

const EC = protractor.ExpectedConditions;
const timeout = 30000;

//Translate country names to set language
const germanyCountryName = Object.freeze({
    UK: "Vereinigtes Königreich Großbritannien und Nordirland",
    ITALY: "Italien",
    FRANCE: "Frankreich"
  });

class SearchPage {

    constructor(){
        this.minSizevalue = element(by.css('span.ng5-slider-span.ng5-slider-bubble.ng5-slider-model-value'));
        this.minSizeSlider = element(by.css('span.ng5-slider-span.ng5-slider-pointer.ng5-slider-pointer-min'));
        this.cityDropdown = element(by.css('#mat-select-1'));
        this.options = element.all(by.css('mat-option[role="option"]'));
        this.countApartmentLabel = element(by.css('h2.ng-star-inserted'));
        this.listOfApartments = element.all(by.css('div[class="item ng-star-inserted"] > a'));
        this.mapLink = element(by.css('div[aria-label="Map"] > div > a > span'));
        this.googleMap = element(by.css('div.agm-map-container-inner.sebm-google-map-container-inner'));
        this.apartmentDetailsTable = element.all(by.css('div[class="row"] > app-unit-item'));
        this.languageMenu = element(by.css('button[aria-label="Language"]'));
        this.languageDialogBox = element(by.css('.mat-dialog-actions > button'));
    }

    isMapVisible(){
        browser.wait(EC.visibilityOf(this.mapLink), timeout);
        this.mapLink.click();
        return this.googleMap.isDisplayed();
    }

    randomArray(array){
        return array[Math.floor(Math.random() * array.length)];
    }

    async startURL(countryLanguage, title){
        await browser.get('/');
        this.setLanguage(countryLanguage);
        await this.waitForTitle(title);
        return this;
    }

    setLanguage(countryLanguage){

        //Select language option in Menu
        browser.wait(EC.elementToBeClickable(this.languageMenu), timeout);
        this.languageMenu.click()

        //Translation the country name from English to German to inspect the element on map
        var selectedLanguage = this.lookForCountry(germanyCountryName, countryLanguage);
        
        //Select country on displayed Map
        var language = element(by.countryValue(selectedLanguage))
        browser.wait(EC.presenceOf(language), timeout);
        language.click();

        //Select the language on box dialog
        browser.wait(EC.elementToBeClickable(this.languageDialogBox), timeout);
        this.languageDialogBox.click();

        //Wait map screen closes
        browser.wait(EC.invisibilityOf(language), timeout);
    }

    lookForCountry(constant, value){
        for (var k in constant){
          if (k == value){
              return constant[k];
          }
        }
    }

    async waitForTitle(txt){
        await browser.wait(EC.titleIs(txt), timeout);
        return this;
    }

    inputOptions(city, minSize){
        this.selectCity(city);
        this.setMinSize(minSize);
        return this;
    }

    async setMinSize(suggestedSize){
        browser.wait(EC.visibilityOf(this.minSizeSlider), timeout);
        browser.wait(EC.visibilityOf(this.minSizevalue), timeout);

        var min = await this.minSizevalue.getText()

        for(var i=1; min < suggestedSize-2; i++){
           await browser.actions().
                mouseMove(this.minSizeSlider).
                mouseMove({x: i, y: 0}).
                doubleClick().
                perform();
            min = await this.minSizevalue.getText()
        }
        this.checkCountOfApartments();
    }

    selectCity(selectedValue){
        browser.wait(EC.visibilityOf(this.cityDropdown), timeout);
        
        this.cityDropdown.click();
        this.chooseOptionsFromDropdown(selectedValue);
        return this;
    }

    chooseOptionsFromDropdown(selectedValue){
        this.options.each(async(element, index)=>{
            if (await element.getText() === selectedValue){
                element.isDisplayed();
                browser.wait(EC.presenceOf(element), timeout);
                element.click();
            }
        })
    }

    async checkCountOfApartments(){
        //Get count of apartments which is shown in the label
        var countTitle = this.getCountOfApartmentsFromLabel();

        //Get count of filtered apartments in the list
        this.listOfApartments.then((item)=>{

            //Check the count of apartments displayed
            expect(countTitle).toBe(item.length);
        })

        //Get all ID's of apartments in the page using the attribute 'href'
        var list = await this.listOfApartments.getAttribute("href")
        var idList = []
        for(var i=0; i < list.length; i++){
            idList[i] = list[i].split('/').pop()
        }

        //Looking for duplicates apartment ID's (Remove duplicate ID's)
        const idDistinct = idList.filter(function(value, index, self){
            return self.indexOf(value) === index;
        })
        
        //Check if the apartment is shown only once
        expect(idList.length).toBe(idDistinct.length);
        return this;
    }

    async getFilteredApartmentByIndex(index){
        //-------------------------------------------------------------------------------------
        //The variable 'detailsArray' will return an array with the following template:
        //Index '0' => Headline
        //Index '1' => District (NOT REQUIRED)
        //Index '2' => Address
        //Index '3' => Rooms
        //Index '4' => Size
        //Index '5' => Floor
        //Index '6' => Price
        //Index '7' => label for availability date
        //Index '8' => Availability date value
        //Index '9' => Link URL to details
        //-------------------------------------------------------------------------------------
        var detailsArray = await this.apartmentDetailsTable.get(index).getText();
        detailsArray = detailsArray.replace("star_border", "");
        detailsArray += await this.apartmentDetailsTable.get(index).element(by.css('div > a')).getAttribute("href");
        return detailsArray.split(/\r?\n/);
    }

    async getCountOfApartmentsFromLabel(){
        browser.wait(EC.visibilityOf(this.countApartmentLabel), timeout);
        var countTitle = await this.countApartmentLabel.getText();
        countTitle = Number(countTitle.split(' ')[1]);
        return countTitle;
    }

   gotToDetailsPage(index){
        browser.wait(EC.visibilityOf(this.apartmentDetailsTable.get(index)), timeout);
        
        this.executeScriptForScrollToElement(this.apartmentDetailsTable.get(index));
        this.apartmentDetailsTable.get(index).click();
        return require('../pages/details.po');
    }

    executeScriptForScrollToElement(element){
        browser.executeScript("arguments[0].scrollIntoView();", element.getWebElement());
        return this;
    }
};
module.exports = new SearchPage();