const R = require ('ramda')

//---------------------------------
// overwrite state with payload
//---------------------------------

const overwriteStateWithPayload = R.uncurryN (2, state => R.prop ('payload'))

module.exports.overwriteStateWithPayload = overwriteStateWithPayload

//---------------------------------
// update item with
// ... assumes state is item
// ... assumes payload { data }
//---------------------------------

const updateItemWith = predicate => R.uncurryN (2, state => R.pipe (
  R.path (['payload', 'data']),
  R.ifElse (predicate, R.identity, R.always (state)),
))

module.exports.updateItemWith = updateItemWith

//---------------------------------
// update item by index with
// ... assumes array state
// ... assumes payload { data, index }
//---------------------------------

const updateItemByIndexWith = predicate => (state, action) => R.pipe (
  R.path (['payload', 'index']),
  R.converge (R.update (R.__, R.__, state), [
    R.identity,
    R.pipe (
      R.prop (R.__, state),
      updateItemWith (predicate) (R.__, action),
    ),
  ]),
) (action)

module.exports.updateItemByIndexWith = updateItemByIndexWith
