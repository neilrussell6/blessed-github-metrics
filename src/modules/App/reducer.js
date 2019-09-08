const { endpoint } = require ('../../common/redux/utils')
const R = require ('ramda')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = {
  selectedSectionIndex: 0,
}

//---------------------------------
// actions
//---------------------------------

const FOCUS_SECTION = 'app/App/FOCUS_SECTION'

module.exports.actions = {
  FOCUS_SECTION,
}

//---------------------------------
// action creators
//---------------------------------

const focusSection = index => ({ type: FOCUS_SECTION, payload: index })

module.exports.actionCreators = {
  focusSection,
}

//---------------------------------
// reducers
//---------------------------------

const setFocusedSectionIndex = (state, { payload }) => R.assoc ('selectedSectionIndex', payload, state)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [FOCUS_SECTION]: setFocusedSectionIndex,
}

module.exports.reducer = endpoint (reducers, INITIAL_STATE)
