const { mapTo, delay } = require ('rxjs/operators')
const { ofType } = require ('redux-observable')

const { INIT_APP, initAppSuccess } = require ('./reducer')

//---------------------------------
// init app
//---------------------------------

module.exports.initAppEpic = action$ => (
  action$.pipe (
    ofType (INIT_APP),
    delay (100), // TODO: remove this once store is updated to wait for rabbitmq logger to complete
    mapTo (initAppSuccess ()),
  )
)
