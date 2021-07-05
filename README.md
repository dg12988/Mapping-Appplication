To run this project you must first install the following: 
1. node.js: https://nodejs.org/en/
2. Angular CLI: https://cli.angular.io/

From there, download/clone the project from master.
The project uses two JSON files for data import that you will need to host. For testing/development use a local (fake)REST server.

Run CMD
Navigate to ../cw-mapping/assets

type the following command
json-server --watch testConfig.json

Run another instance of CMD
Navigate to ../cw-mapping/assets

type the following command
json-server -p 4000 --watch adjInfo.json

Finally, cd back to the project folder and type the command ng serve.

Go to your browser and enter http://localhost:4200/


////// ANGULAR //////

# Maptest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
