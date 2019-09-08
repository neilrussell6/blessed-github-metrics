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
