const Container = require ('./container')
const reducer = require ('./reducer')
const epics = require ('./epics')

module.exports = {
  Component: Container,
  ...reducer,
  epics,
}
