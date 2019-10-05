const R = require ('ramda')
const { createSelector } = require ('reselect')

const Settings = require ('../../config/settings')
const _R = require ('../../common/utils/ramda.utils')

const pullRequestEventsSelector = createSelector ([
  R.prop ('pullRequestEvents'),
], R.pipe (
  R.map (
    _R.assocSpec ({
      responsibleParticipants: R.pipe (
        R.prop ('participants'),
        R.filter (R.propEq ('isResponsible') (true)),
        R.pluck ('login'),
        R.join (', ')
      ),
    })
  ),
  R.objOf ('pullRequestEvents'),
))

module.exports.pullRequestEventsSelector = pullRequestEventsSelector

const isFocusedSelector = createSelector ([
  R.prop ('app'),
], R.applySpec ({
  isFocused: R.propEq ('selectedSectionIndex', 1),
}))

module.exports.isFocusedSelector = isFocusedSelector

const columnsConfigSelector = R.always (
  R.pipe (
    R.path (['pullRequestEvents' , 'tableColumnsConfig']),
    R.objOf ('columnsConfig'),
  ) (Settings)
)

module.exports.columnsConfigSelector = columnsConfigSelector

const selector = createSelector ([
  pullRequestEventsSelector,
  isFocusedSelector,
  columnsConfigSelector,
], (
  { pullRequestEvents },
  { isFocused },
  { columnsConfig },
) => ({
  pullRequestEvents,
  isFocused,
  columnsConfig,
}))

module.exports.selector = selector
