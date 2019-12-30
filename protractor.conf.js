var HtmlReporter = require('protractor-beautiful-reporter');
var env = process.env.env || 'production';
var config = require('./e2e/support/env')[env];

exports.config = {
    directConnect: true,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
    {
      'browserName': 'chrome',
            chromeOptions: {
                args: ['--incognito', '--start-maximized', 'disable-infobars']
            }
      }
      ,
      {
        'browserName': 'firefox'
      }
    ],

      specs: ['./e2e/specs/*.spec.js'],

      suites: {
        search: ['./e2e/specs/search.spec.js'],

        contact_form: ['./e2e/specs/contact_form.spec.js'],
        
         all: ['./e2e/specs/*.spec.js']
      },

      baseUrl: config.baseUrl,
      jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 360000
      },

      onPrepare() {
        browser.driver.manage().window().maximize();
        browser.manage().timeouts().implicitlyWait(10000);
        browser.waitForAngularEnabled(false);

        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'tmp/screenshots',
            screenshotsSubfolder: 'images',
            jsonsSubfolder: 'jsons',
            clientDefaults:{
              showTotalDurationIn: "header",                  
              totalDurationFormat: "hms"            
            } 
        }).getJasmine2Reporter());

        by.addLocator('countryValue',function(text) {
          return document.querySelector(`[aria-labelledby="${text}"] > g > g > path`)
        });
    }
}