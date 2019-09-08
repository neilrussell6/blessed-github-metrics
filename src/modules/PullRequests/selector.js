const R = require ('ramda')
const { createSelector } = require ('reselect')

const _R = require ('../../common/utils/ramda.utils')
const { FORMAT_TEMPLATES } = require('./constants')

const selector = createSelector ([R.identity], R.pipe (
  _R.assocSpec ({
    pullRequests: R.prop('pullRequests'),
    isFocused: R.pathEq (['app', 'selectedSectionIndex'], 0),
    columnsConfig: R.always ([
      { key: 'title', label: 'TITLE', width: 28, ellipsis: 'end' },
      // { key: 'baseRefName', label: 'BASE', width: 12, ellipsis: 'end' },
      // { key: 'headRefName', label: 'BRANCH', width: 14, ellipsis: 'end' },
      { key: 'authorLogin', label: 'AUTHOR', width: 16, ellipsis: 'end' },
      { key: 'state', label: 'STATE', width: 10 },
      { key: 'createdAt', label: 'CREATED', width: 16, ellipsis: 'start', format: 'date', formatTemplate: FORMAT_TEMPLATES.DATE },
      { key: 'publishedAt', label: 'PUBLISHED', width: 16, ellipsis: 'start', format: 'date', formatTemplate: FORMAT_TEMPLATES.DATE },
      { key: 'updatedAt', label: 'UPDATED', width: 16, ellipsis: 'start', format: 'date', formatTemplate: FORMAT_TEMPLATES.DATE },
      { key: 'mergedAt', label: 'MERGED', width: 16, ellipsis: 'start', format: 'date', formatTemplate: FORMAT_TEMPLATES.DATE },
    ]),
  }),
))

module.exports = selector
