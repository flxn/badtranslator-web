# badtranslator-web

This repository contains the VueJS frontend for https://badtranslator.net.

![The Web App](https://flxn.de/images/badtranslator_screenshot.png)

Go to https://badtranslator.net to try it out.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Contribute a translation
To add a new translation:
- Create a new file with the corresponding country code under *src/translations/*
  (Example: for french this would be *src/translations/fr.js*)
- Copy the content of the *src/translations/en.js* file into your newly created translation file
- Translate the english strings into your language
- In *src/translations/loader.js* import your new translation and add it to the exported object

## Interfacing with the API

The badtranslator API server is currently not publicly available.