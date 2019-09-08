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

const FOCUS_SECTION = 'modules/App/FOCUS_SECTION'

const INIT_APP = 'modules/App/INIT_APP'
const INIT_APP_SUCCESS = 'modules/App/INIT_APP_SUCCESS'

module.exports.actions = {
  FOCUS_SECTION,
  INIT_APP,
  INIT_APP_SUCCESS,
}

//---------------------------------
// action creators
//---------------------------------

const focusSection = index => ({ type: FOCUS_SECTION, payload: index })

const initApp = () => ({ type: INIT_APP })
const initAppSuccess = () => ({ type: INIT_APP_SUCCESS })

module.exports.actionCreators = {
  focusSection,
  initApp,
  initAppSuccess,
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
