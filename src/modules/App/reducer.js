const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils')
const { SELECT_PULL_REQUEST } = require ('../PullRequest')

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

const TOGGLE_FOCUS_SECTION = 'modules/App/TOGGLE_FOCUS_SECTION'

const INIT_APP = 'modules/App/INIT_APP'
const INIT_APP_SUCCESS = 'modules/App/INIT_APP_SUCCESS'

const actions = {
  FOCUS_SECTION,
  TOGGLE_FOCUS_SECTION,
  INIT_APP,
  INIT_APP_SUCCESS,
}

//---------------------------------
// action creators
//---------------------------------

const focusSection = index => ({ type: FOCUS_SECTION, payload: index })

const toggleFocusSection = () => ({ type: TOGGLE_FOCUS_SECTION })

const initApp = () => ({ type: INIT_APP })
const initAppSuccess = () => ({ type: INIT_APP_SUCCESS })

const actionCreators = {
  focusSection,
  toggleFocusSection,
  initApp,
  initAppSuccess,
}

//---------------------------------
// reducers
//---------------------------------

const setFocusedSectionIndex = (state, { payload }) => R.assoc ('selectedSectionIndex', payload, state)

const toggleFocusedSectionIndex = state => R.assoc (
  'selectedSectionIndex',
  R.compose (x => x === 1 ? 0 : 1, R.prop ('selectedSectionIndex')) (state),
  state,
)

const setFocusedSectionIndexN = n => state => R.assoc ('selectedSectionIndex', n, state)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [FOCUS_SECTION]: setFocusedSectionIndex,
  [TOGGLE_FOCUS_SECTION]: toggleFocusedSectionIndex,
  [SELECT_PULL_REQUEST]: setFocusedSectionIndexN (1),
}

const reducer = endpoint (reducers, INITIAL_STATE)

module.exports = {
  INITIAL_STATE,
  ...actions,
  ...actionCreators,
  reducer,
}
