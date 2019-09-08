const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils.js')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = {
  type: 'help',
  message: '[^UP|^DOWN] Navigate',
}

//---------------------------------
// reducers
//---------------------------------

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {}

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
