const SearchPage = require('../pages/search.po');
const DetailsPage = require('../pages/details.po');
const dbData= require('../fixtures/data_apartments')
const dbLanguages= require('../fixtures/languages')
const messages = require('../fixtures/alert_messages')
var using = require('jasmine-data-provider');
const chai = require('chai');
const expect = chai.expect;


//***********************************************************************************//
//* SEARCH FOR APARTMENTS USING A SINGLE DATA
//***********************************************************************************//
describe('Filter apartments', ()=>{

    const INDEX = 0;

    beforeEach(()=>{
        SearchPage.startURL(dbData.data[INDEX].country_language, dbData.data[INDEX].title);
    })

    it('Show the results by List', ()=>{
        SearchPage.inputOptions(SearchPage.randomArray(dbData.data[INDEX].city), 
                                dbData.data[INDEX].min_size);
    })

    it('Show the results by Map', async()=>{
        var isSuccess = await SearchPage
                        .selectCity(SearchPage.randomArray(dbData.data[INDEX].city))
                        .isMapVisible();
                    
        expect(true, messages.custom_alerts.search_apartments.MAP_IS_NOT_VISIBLE).to.equal(isSuccess);
    })

    it('Validate details of the apartment', async()=>{
        SearchPage.selectCity(SearchPage.randomArray(dbData.data[INDEX].city));

        await validateApartamentDetails();
    })
})


//***********************************************************************************//
//* SEARCH APARTMENTS IN SEVERAL COUNTRIES
//***********************************************************************************//
describe('Access multiple countries website', ()=>{

    using(dbData.data, function (data) {
        it('Validate details of the apartment for ' + (data.country.toUpperCase()), async()=>{

            //Format the URL passing the country
            await browser.get('/en_UK/search/' + data.country);
            await SearchPage.waitForTitle(data.title);
            
            SearchPage.selectCity(SearchPage.randomArray(data.city));

            await validateApartamentDetails();
        })
    })
})


//***********************************************************************************//
//* SEARCH APARTMENTS USING DIFFERENT LANGUAGES
//***********************************************************************************//
describe('Select multiple languages', ()=>{

    using(dbLanguages.data, function (data) {
        it('Validate apartment details using the country language for ' + (data.country_language.toUpperCase()), async()=>{
            
            await SearchPage.startURL(data.country_language, data.title);
            
            await validateApartamentDetails();
        })
    })
})


async function validateApartamentDetails() {

    //Generate a random number based on the list of apartments
    var countOfApartment = await SearchPage.getCountOfApartmentsFromLabel();
    randomIndex= Math.floor(Math.random() * countOfApartment - 1);
                
    //Select a random apartment from Search Page and stores all information in an array
    var apartmentInformationFromList = await SearchPage.getFilteredApartmentByIndex(randomIndex);
                
    //Navigate to Details Page
    SearchPage.gotToDetailsPage(randomIndex).executeScriptForScrollUP();
                
    //Check the apartment details
    expect(apartmentInformationFromList[0]).to.equal(await DetailsPage.getHeadline(), messages.custom_alerts.search_apartments.MISMATCH_HEADLINE);
    expect(apartmentInformationFromList[1]).to.equal(await DetailsPage.getDistrict(), messages.custom_alerts.search_apartments.MISMATCH_DISTRICT);
    expect(apartmentInformationFromList[2]).to.equal(await DetailsPage.getAddress(), messages.custom_alerts.search_apartments.MISMATCH_ADDRESS);
    expect(apartmentInformationFromList[3]).to.equal(await DetailsPage.getCountOfRoom(), messages.custom_alerts.search_apartments.MISMATCH_ROOM);
    expect(apartmentInformationFromList[4]).to.equal(await DetailsPage.getSizeOfApartment(), messages.custom_alerts.search_apartments.MISMATCH_SIZE);
    expect(apartmentInformationFromList[5]).to.equal(await DetailsPage.getFloor(), messages.custom_alerts.search_apartments.MISMATCH_FLOOR);
    expect(apartmentInformationFromList[6]).to.equal(await DetailsPage.getPrice(), messages.custom_alerts.search_apartments.MISMATCH_PRICE);
    expect(apartmentInformationFromList[8]).to.equal(await DetailsPage.getAvailabilityDate(), messages.custom_alerts.search_apartments.MISMATCH_AVAILABILITY);
    expect(apartmentInformationFromList[9]).to.equal(await browser.getCurrentUrl(), messages.custom_alerts.search_apartments.MISMATCH_URL_REFERENCE);
    expect(await browser.getCurrentUrl()).to.include(await DetailsPage.getIdentificationID(), messages.custom_alerts.search_apartments.MISMATCH_IDENTIFICATION_ID);
}