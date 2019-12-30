# Protractor 

E2E testing project with Protractor (JavaScript)


### Folder Structure
```
├── README.md
├── e2e
│   ├── fixtures
│   │   ├── alert_messages.js
│   │   ├── data_apartments.js
│   │   ├── data_contacts.js
│   │   └── languages.js
│   │
│   ├── pages
│   │   ├── contact_form.po.js
│   │   ├── detail.po.js
│   │   └── search.po.js
│   │
│   ├── specs
│   │   ├── contact_form.spec.js
│   │   └── search.spec.js
│   │
│   └── support
│       └── env.js
│
├── protractor.conf.js
└── package.json
```


### Requirements

- `Node.js` has to be installed
- Protractor 5.4.2 should be installed and setup - `npm install -g protractor@5.4.2`
- Chrome browser (latest version)
- Firefox browser (latest version)
- Add node_modules in same directory


### Dependencies

- chai `Provide different assertion styles`
- jasmine-data-provider `Allows to create multiple data sets to be run`
- protractor-beautiful-reporter `Generate html report with screenshots`


### Package.json scripts

In `package.json` file is defined all test suites, such as:
```
├── scripts
    ├── webdriver-update
    ├── webdriver-start
    ├── protractor
    ├── test-search
    ├── test-contact_form
    └── smoke
```

### Installation (Important)

- Install all dependencies
```
npm install
```

- Update webdriver
```
npm run webdriver-update
```


### Running the tests

- Run `webdriver-update`:
```
npm run webdriver-update
```

- Run `webdriver-start`:
```
npm run webdriver-start
```

- Run all test cases:
```
npm run protractor
```

- Run only search.spec.js:
```
npm run test-search
```

- Run only contact_form.spec.js:
```
npm run test-contact_form
```

- Run all test cases:
```
npm run smoke
```


### Report with screenshots
After execution is generated a report in the directory `tmp/screenshots/report.html`