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
  console.log(Comps.table)
  const { view: tableView, data: tableData } = Comps.table ({ parent, theme: greyTheme, rows, columnsConfig })
  const { height: tableHeight } = tableData
  const view = blessed.box ({
    left: 3,
    top: 2,
    height: tableHeight,
    width: '100%-6',
  })
  view.append (tableView)

  // ... placeholder
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

  return { view, placeholder, data: { height: tableHeight } }
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
  parent.screen.key (['S-left'], (ch, key) => {
    if (state.isFocused) { onNavigate (0) }
  })
  parent.screen.key (['S-right'], (ch, key) => {
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
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const styleBorderBox = buildStyleDarkBorderBox (isFocused ? theme : greyTheme)

  // ... calculations
  const paddingBottom = isFocused ? 3 : 2

  // ... view
  // ... ... border
  state.borderView.style.border.fg = R.path (['style', 'border', 'fg'], styleBorderBox)
  state.borderView.style.label.fg = R.path (['style', 'label', 'fg'], styleBorderBox)
  state.borderView.height = (isFocused ? state.tableViewHeight : 1) + paddingBottom

  // ... ... table
  if (isFocused) {
    state.tableView.show ()
    state.tablePlaceholderView.hide ()
  } else {
    state.tableView.hide ()
    state.tablePlaceholderView.show ()
  }

  // ... calculations
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, '')), pullRequests)

  state.tableViewTable.update ({ parent: view, rows, columnsConfig })

  // ... view
  view.height = (isFocused ? state.tableViewHeight : 1) + paddingBottom

  // ... state
  state.isFocused = isFocused
}

module.exports.update = update
