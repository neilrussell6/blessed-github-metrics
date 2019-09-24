const reducer = require ('./reducer')
const Container = require ('./container')
const epics = require ('./epics')

module.exports = {
  Component: Container,
  ...reducer,
  epics,
}
