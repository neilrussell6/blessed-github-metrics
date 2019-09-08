const R = require ('ramda')

//-----------------------------------------
// pick all (with null default)
//-----------------------------------------

const pickAll = (keys, obj, def=null) => R.pipe (
  R.pickAll (keys),
  R.map (R.ifElse (R.isNil, R.always (def), R.identity)),
) (obj)

module.exports.pickAll = pickAll

//-----------------------------------------
// assocSpec
//-----------------------------------------

const assocSpec = R.curry ((spec, source) => R.pipe (
  R.map (f => f (source)),
  R.mergeDeepRight (source),
) (spec))

module.exports.assocSpec = assocSpec

//-----------------------------------------
// rename keys
//-----------------------------------------

const renameKeys = R.curry ((keysMap, obj) => (
  R.reduce ((acc, key) => R.assoc (keysMap[key] || key, obj[key], acc), {}, R.keys (obj))
))

module.exports.renameKeys = renameKeys
