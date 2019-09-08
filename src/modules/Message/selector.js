const R = require ('ramda')
const { createSelector } = require ('reselect')

const selector = createSelector ([R.identity], (
  R.applySpec ({
    type: R.path (['message', 'type']),
    message: R.path (['message', 'message']),
  })
))

module.exports = selector
