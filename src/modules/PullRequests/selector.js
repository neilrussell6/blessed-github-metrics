const R = require ('ramda')
const { createSelector } = require ('reselect')

const Settings = require('../../config/settings')
const _R = require ('../../common/utils/ramda.utils')

const selector = createSelector ([R.identity], R.pipe (
  _R.assocSpec ({
    pullRequests: R.prop('pullRequests'),
    isFocused: R.pathEq (['app', 'selectedSectionIndex'], 0),
    columnsConfig: R.always (R.path (['pullRequests' , 'tableColumnsConfig']) (Settings)),
  }),
))

module.exports = selector
