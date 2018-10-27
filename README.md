# LDSOt4g3 - Electronics Warehouse System for Universities

Electronics warehouses are specific because of the diversity of request to be kept: external purchase orders, small components reusable or not, large list of similar components that might be under stock, etc. 

Cost management, bulk purchase orders and diversity of stackeholders also amount to the complexity of the system. 

The system would ideally communicate via B2B standard protocols with large suppliers, compare prices and suggest components in stock to answer customer requests. 

Workflow configuration and shibboleth UP integration should integrate easily for a comfortable user experience for students, professors, financial managers and warehouse workers.	

## Tools we use

  - [NodeJS](https://nodejs.org/en/)
  - [Express](http://expressjs.com/)
  - [React](https://reactjs.org/)
  - [Webpack](https://webpack.js.org/)
  - [Babel](https://babeljs.io/)
  - [Semantic UI](https://semantic-ui.com/)
  - [React Router](https://reacttraining.com/react-router/)
  - [Nodemon](https://nodemon.io/)
  - [ESLint](https://eslint.org/)

## Directory Structure

Below is overview of project folder structure in this starter along with the short descriptions, respectively:

```
bin                             # node server files of app and api
build                           # parent directory of scripts/webpack
|-- scripts                     # build scripts for tooling purposes
|-- webpack                     # webpack config for both client & server
config                          # app level configuration
node_modules                    # installed dependencies of the app
public                          # production built assets
resources                       # parent directory of resources
|-- assets                      # parent directory of all assets
|   |-- manifest.json           # manifest JSON file for web app
|   |-- icons                   # source files of icon
|   |-- images                  # source files of image
|-- fixtures                    # fixture data for development
|-- mocks                       # file & style mocks for jest
|-- views                       # source files of view template
src                             # parent directory of both api & app source code
|-- api                         # parent directory of api source code
|   |-- routers                 # respective Express routes for API
|-- app                         # parent directory of app source code
|   |-- common                  # reusable React components & styles
|   |   |-- components          # reusable React components for common usage
|   |   |-- styles              # reusable CSS/SCSS for the app
|   |-- pages                   # page components based on "modules"
|-- middlewares                 # all middlewares used for the app
|   |-- express                 # middlewares for Express framework
|-- utils                       # utilities used for both client & server
```

#### More Info

More detailed informations about the project on the [Project's Wiki](https://gitlab.com/ldso18-19/t4g3/wikis/home).
