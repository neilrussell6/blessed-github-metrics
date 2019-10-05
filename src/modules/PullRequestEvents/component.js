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

const buildTable = ({ parent, pullRequestEvents, columnsConfig, isFocused }) => {
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const styleBox = buildStyleBox (greyTheme)

  // ... calculations
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, ''))) (pullRequestEvents)

  // ... view
  const { view: tableView, table } = Comps.table ({ parent, theme: greyTheme, rows, columnsConfig })
  const view = blessed.box ({
    left: 3,
    top: 2,
    height: '100%-4',
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

  return { view, table, placeholder, data: {} }
}

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, columnsConfig, pullRequestEvents, isFocused, onNavigate }) => {
  // ... styles
  const styleBorderBox = buildStyleDarkBorderBox (theme)

  // ... view
  // ... ... table
  const {
    view: tableView,
    table: tableViewTable,
    placeholder: tablePlaceholderView,
    data: tableViewData,
  } = buildTable ({ parent, pullRequestEvents, columnsConfig, isFocused })
  const { height: tableViewHeight } = tableViewData

  const viewHeight = 4//tableViewHeight

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
      label: ' PULL REQUEST : TIMELINE ',
    },
  ))
  view.append (borderView)

  // ... ... table
  view.append (tableView)
  view.append (tablePlaceholderView)
  tablePlaceholderView.hide ()

  // ... state
  state.borderView = borderView
  state.tableView = tableView.children[0]
  state.tableViewTable = tableViewTable
  state.tablePlaceholderView = tablePlaceholderView
  state.tableViewHeight = tableViewHeight
  state.isFocused = isFocused

  // ...
  return { view, data: { height: viewHeight } }
}

module.exports.init = init

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ columnsConfig, pullRequestEvents, isFocused }) => {
  // ... styles
  const greyTheme = themes[THEME_GREY]
  const _theme = isFocused ? theme : greyTheme

  // ... calculations
  const keys = R.pluck ('key', columnsConfig)
  const rows = R.map (R.compose (R.values, _R.pickAll (keys, R.__, '')), pullRequestEvents)

  // ... view
  // ... ... border
  state.borderView.style.border.fg = _theme['1']
  state.borderView.style.label.fg = _theme['4_faded']
  // ... ... table
  state.tableView.update ({ parent: view, rows, columnsConfig })
  if (isFocused) {
    state.tableViewTable.focus()
    if (isFocused !== state.isFocused) {
      state.tableViewTable.rows.select(0)
    }
  }

  // ... state
  state.isFocused = isFocused
  state.pullRequestEvents = pullRequestEvents

  view.render()
}

module.exports.update = update
