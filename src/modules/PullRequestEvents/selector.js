const R = require ('ramda')
const { createSelector } = require ('reselect')

const Settings = require('../../config/settings')
const _R = require ('../../common/utils/ramda.utils')

const selector = createSelector ([R.identity], R.pipe (
  _R.assocSpec ({
    pullRequestEvents: R.path(['pullRequestEvents', 0]),
    isFocused: R.pathEq (['app', 'selectedSectionIndex'], 1),
    columnsConfig: R.always (R.path (['pullRequestEvents' , 'tableColumnsConfig']) (Settings)),
  }),
))

module.exports = selector
