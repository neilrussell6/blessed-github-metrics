const R = require ('ramda')

const { endpoint } = require ('../../common/redux/utils.js')
const {
  MESSAGE_TYPE_DEFAULT,
  MESSAGE_TYPE_HELP,
  MESSAGE_TYPE_ERROR,
} = require ('./constants')

//---------------------------------
// initial state
//---------------------------------

const INITIAL_STATE = {
  type: MESSAGE_TYPE_HELP,
  message: '[^UP|^DOWN] Navigate',
}

//---------------------------------
// actions
//---------------------------------

const SET_MESSAGE = 'modules/Message/SET_MESSAGE'

const SET_HELP_MESSAGE = 'modules/Message/SET_HELP_MESSAGE'

const SET_ERROR_MESSAGE = 'modules/Message/SET_ERROR_MESSAGE'

const RESET_MESSAGE = 'modules/Message/RESET_MESSAGE'

const actions = {
  SET_MESSAGE,
  SET_HELP_MESSAGE,
  SET_ERROR_MESSAGE,
  RESET_MESSAGE,
}

//---------------------------------
// action creators
//---------------------------------

const setMessage = payload => ({ type: SET_MESSAGE, payload })

const setHelpMessage = payload => ({ type: SET_HELP_MESSAGE, payload })

const setErrorMessage = payload => ({ type: SET_ERROR_MESSAGE, payload })

const resetMessage = payload => ({ type: RESET_MESSAGE, payload })

const actionCreators = {
  setMessage,
  setHelpMessage,
  setErrorMessage,
  resetMessage,
}

//---------------------------------
// reducers
//---------------------------------

const setMessageWithType = type => (state, { payload }) => R.pipe (
  R.objOf ('message'),
  R.mergeDeepRight ({ type }),
) (payload)

//---------------------------------
// action -> reducer mapping
//---------------------------------

const reducers = {
  [SET_MESSAGE]: setMessageWithType (MESSAGE_TYPE_DEFAULT),
  [SET_HELP_MESSAGE]: setMessageWithType (MESSAGE_TYPE_DEFAULT),
  [SET_ERROR_MESSAGE]: setMessageWithType (MESSAGE_TYPE_ERROR),
  [RESET_MESSAGE]: R.always (INITIAL_STATE),
}

const reducer = endpoint (reducers, INITIAL_STATE)

module.exports = {
  INITIAL_STATE,
  ...actions,
  ...actionCreators,
  reducer,
}
