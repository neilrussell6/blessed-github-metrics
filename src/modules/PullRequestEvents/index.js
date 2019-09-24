const Container = require ('./container')
const reducer = require ('./reducer')
const epics = require ('./epics')
const constants = require('./constants')

module.exports = {
  Component: Container,
  ...reducer,
  ...constants,
  epics,
}
