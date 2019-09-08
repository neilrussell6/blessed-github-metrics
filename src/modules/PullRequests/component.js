const blessed = require ('blessed')
const R = require ('ramda')

const { buildStyleDarkBorderBox, buildStyleBox } = require ('../../common/styles')
const { theme, themes, THEME_GREY } = require ('../../common/color-themes')
const Comps = require ('../../common/components/index')
const _R = require ('../../common/utils/ramda.utils')

// --------------------------------------
// constants
// --------------------------------------

// --------------------------------------
// state
// --------------------------------------

let state = {}

// --------------------------------------
// helpers
// --------------------------------------

const buildTable = ({ parent, pullRequests, columnsConfig }) => {
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const styleBox = buildStyleBox (greyTheme)

  // ... calculations
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, '')), pullRequests)

  // ... view
  // ... ... table
  const { view: tableView, table, data: tableData } = Comps.table ({ parent, theme: greyTheme, rows, columnsConfig })
  const { height: tableHeight } = tableData
  const view = blessed.box ({
    left: 3,
    top: 2,
    height: tableHeight - 1,
    width: '100%-6',
  })
  view.append (tableView)

  // ... ... ... allow keyboard control
  table.focus ()

  // ... ... placeholder
  const placeholder = blessed.box (R.mergeDeepRight (
    styleBox,
    {
      left: 3,
      top: 1,
      height: 1,
      width: 3,
      content: '...',
    },
  ))

  return { view, table, placeholder, data: { height: tableHeight } }
}

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, columnsConfig, pullRequests, isFocused, onNavigate }) => {
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const styleBorderBox = buildStyleDarkBorderBox (isFocused ? theme : greyTheme)

  // ... calculations
  const paddingBottom = isFocused ? 3 : 2

  // ... view
  // ... ... table
  const {
    view: tableView,
    placeholder: tablePlaceholderView,
    data: tableViewData,
  } = buildTable ({ parent, pullRequests, columnsConfig })
  const { height: tableViewHeight } = tableViewData

  const viewHeight = isFocused ? tableViewHeight : 1

  const view = blessed.box ({
    left: 0,
    top: 0,
    height: viewHeight + paddingBottom,
    width: '100%',
  })

  // ... ... border
  const borderView = blessed.box (R.mergeDeepRight (
    styleBorderBox,
    {
      left: 0,
      top: 0,
      height: viewHeight + paddingBottom,
      width: '100%',
      label: ' PULL REQUESTS ',
    },
  ))
  view.append (borderView)

  // ... ... table
  view.append (tableView)
  view.append (tablePlaceholderView)
  if (isFocused) {
    tablePlaceholderView.hide ()
  } else {
    tableView.hide ()
  }

  // ... state
  state.borderView = borderView
  state.tableView = tableView
  state.tableViewTable = tableView.children[0] // TODO: do this better
  state.tablePlaceholderView = tablePlaceholderView
  state.tableViewHeight = tableViewHeight
  state.isFocused = isFocused

  // ... events
  parent.screen.key (['up'], (ch, key) => {
    if (state.isFocused) { onNavigate (-1) }
  })
  parent.screen.key (['down'], (ch, key) => {
    if (state.isFocused) { onNavigate (1) }
  })

  // ...
  return { view, data: { height: viewHeight } }
}

module.exports.init = init

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ columnsConfig, pullRequests, isFocused }) => {
  // ... calculations
  const paddingBottom = isFocused ? 3 : 2
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, '')), pullRequests)

  // ... view
  // ... ... table
  state.tableViewTable.update ({ parent: view, rows, columnsConfig })

  view.height = 20//state.tableViewHeight + paddingBottom

  // ... state
  state.isFocused = isFocused
  // state.tableView.render()
}

module.exports.update = update
