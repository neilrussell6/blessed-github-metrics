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
  const { view: tableView, table } = Comps.table ({ parent, theme: greyTheme, rows, columnsConfig })
  const view = blessed.box ({
    left: 3,
    top: 2,
    height: '100%-3',
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

  return { view, table, placeholder, data: {} }
}

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, columnsConfig, pullRequests, isFocused, onNavigate, onSelect }) => {
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const _theme = isFocused ? theme : greyTheme
  const styleBorderBox = buildStyleDarkBorderBox (_theme)

  // ... view
  // ... ... table
  const {
    view: tableView,
    table: tableViewTable,
    placeholder: tablePlaceholderView,
    data: tableViewData,
  } = buildTable ({ parent, pullRequests, columnsConfig })
  const { height: tableViewHeight } = tableViewData

  const viewHeight = isFocused ? tableViewHeight : 1

  const view = blessed.box ({
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
  })

  // ... ... border
  const borderView = blessed.box (R.mergeDeepRight (
    styleBorderBox,
    {
      left: 0,
      top: 0,
      height: '100%',
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
  state.tableView = tableView.children[0]
  state.tableViewTable = tableViewTable
  state.tablePlaceholderView = tablePlaceholderView
  state.tableViewHeight = tableViewHeight
  state.isFocused = isFocused

  // ... events
  tableViewTable.rows.on ('keypress', (x, ch) => {
    if (R.compose (R.includes (R.__, ['up', 'down']), R.prop ('name')) (ch)) {
      onNavigate (tableViewTable.rows.selected)
    }
  })

  tableViewTable.rows.on ('select', (x, i) => {
    onSelect (R.path (['pullRequests', i]) (state))
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
  const _theme = isFocused ? theme : greyTheme

  // ... calculations
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, '')), pullRequests)

  // ... view
  // ... ... border
  state.borderView.style.border.fg = _theme['1']
  state.borderView.style.label.fg = _theme['4_faded']
  // ... ... table
  state.tableView.update ({ parent: view, rows, columnsConfig })
  if (isFocused) {
    state.tableViewTable.focus ()
  }
  if (isFocused && state.isFocused !== isFocused) {
    state.tableViewTable.rows.scrollTo (0)
  }

  // ... state
  state.isFocused = isFocused
  state.pullRequests = pullRequests
}

module.exports.update = update
