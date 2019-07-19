# Final project
# Responsive and Scalable Web Applications

*FRIDAY 19TH OF JULY*

## Description

This project is based on the content of the course using all the tools learned to build a web page.
The requirements for this project are described in the instructions for the project:

## Instructions

This work is part of the continuous assessment of this class and will be the basis for your final project.
Your final grade will be calculated based on the final project’s result and your Git’s history.

The project in itself is a simple web API with a dashboard that should allow you to :

* API side
  - CRUD your own metrics (make use of an authorization middleware)
* Front side
  - Log in
  - Insert/update/delete metrics once logged in
  - Retrieve the user’s metrics and display it in a graph
  - Only access the user’s metrics, not the other ones
* Utils
  - pre-populate the database with at least two users and their own metrics

The codebase should:

* be commented when necessary (listing the routes and parameters in the README is ok)
* be unit tested with mocha and chai
* use travis-ci
* have the necessary project files (README, package.json, package-lock.json or yarn.lock; .gitignore, ts-config.json, ...) as shown in class
* not have any file/dir in git that shouldn't be (node_modules, .idea, ...)

The project is build using the following tools:

  - css
  - ejs
  - html
  - node-js
  - Bootstrap
  - javascript
  - typescript

## Notation process

To test your codebase, the following steps will be taken:

* Observe the repo's git history
* `git clone` the project
* Run:
  - `npm install`
  - `npm run populate`
  - `npm test`
  - `npm run dev` or `npm start`
* Play with the front UI
* Test the API to:
  - insert metrics unlogged
  - try reading metrics unlogged
  - login and try reading someone else's metrics
* Read and analyse the codebase

To facilitate the process, don't hesitate to add as much information as possible in the README.md ! And cloning the project freshly + running the
instructions as I will might be a good process for final validation...

Also: *DON'T FORGET TO MAKE YOUR REPO PUBLIC*

The codes made in class were used as a support, to refresh and double check things as the sintax.
Our code was started from zero following the steps in the presentations to use the content of the course.

## Some useful links

* TypeScript documentation: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
* Mocha documentation: [https://mochajs.org/](https://mochajs.org/)
* Chai documentation: [https://www.chaijs.com/api/bdd/](https://www.chaijs.com/api/bdd/)
* D3.JS documentation:[ http://d3js.org/]( http://d3js.org/)
* JQuery documentation: [https://code.jquery.com/](https://code.jquery.com/)
* Bootstrap documentation: [http://getbootstrap.com/](http://getbootstrap.com/)
* MongoDB documentation:[ https://docs.mongodb.com/manual/](https://docs.mongodb.com/manual/)

# Thanks!