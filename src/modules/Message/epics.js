const { map } = require ('rxjs/operators')
const R = require('ramda')

const { ofTypeMatch } = require('../../common/utils/rxjs.utils')
const { setErrorMessage } = require ('./reducer')

//---------------------------------
// failure
//---------------------------------

module.exports.setErrorMessageEpic = action$ => (
  action$.pipe (
    ofTypeMatch (/FAILURE$/),
    map (R.prop ('payload')),
    map (setErrorMessage),
  )
)
