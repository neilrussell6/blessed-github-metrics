const R = require ('ramda')
const { createSelector } = require ('reselect')

const selector = createSelector ([R.prop ('message')], (
  R.applySpec ({
    type: R.prop ('type'),
    message: R.prop ('message'),
  })
))

module.exports = selector
