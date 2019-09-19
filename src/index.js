const blessed = require ('blessed')
require ('graphql-import-node/register')

const { configureStore } = require ('./common/redux/store.js')
const Common = require ('./common/components')
const { Component: App } = require ('./modules/App')

// --------------------------------------
// screen
// --------------------------------------

const screen = blessed.screen (Common.screen ())
screen.title = 'GITHUB METRICS'

// --------------------------------------
// view
// --------------------------------------

const store = configureStore ()
const { view: appView } = App (store) (screen)

screen.append (appView)

// --------------------------------------
// events
// --------------------------------------

// quit on Escape, q, or Control-C
screen.key (['escape', 'q', 'C-c'], (ch, key) => process.exit (0))

// --------------------------------------
// ...
// --------------------------------------

screen.render ()
