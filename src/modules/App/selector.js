const R = require ('ramda')
const { createSelector } = require ('reselect')

const selector = createSelector ([R.identity], R.applySpec ({
  selectedSectionIndex: R.path (['app', 'selectedSectionIndex']),
}))

module.exports = selector
