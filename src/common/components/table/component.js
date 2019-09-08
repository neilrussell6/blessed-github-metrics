const blessed = require ('blessed')
const contrib = require ('blessed-contrib')
const R = require ('ramda')

const { buildStyleTable } = require ('../../styles')
const { themes, themeName: defaultThemeName, THEME_GREY } = require ('../../color-themes')
const line = require ('../line')
const MiscUtils = require ('../../utils/misc.utils')

// --------------------------------------
// footer
// --------------------------------------

const buildTableFooter = (parent, theme, columns, columnsConfig, color = null) => {
  // ... styles

  // ... calculations
  const columnPositions = R.reduce ((acc, { width }) => (
    [...acc, R.last (acc) + width]
  )) ([0]) (columnsConfig)

  // ... views
  const view = blessed.box ({
    left: 0,
    top: 0,
    height: 1,
    width: '100%',
  })

  // ... columns
  R.forEach (([position, config]) => {
    const { key, width } = config
    const columnViewParams = {
      left: position,
      height: 1,
      width,
      content: R.prop (key, columns),
      style: {
        fg: R.propOr (R.prop ('6', theme), color, theme),
        bold: true,
      },
    }
    const columnView = blessed.box (columnViewParams)
    view.append (columnView)
  }) (R.zip (columnPositions) (columnsConfig))

  return { view }
}

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ parent, rows, columnsConfig, footer }) => {
  // defaults
  const _footer = R.ifElse (R.isNil, R.always (null), R.identity) (footer)

  // ... views

  // ... ... table
  const data = R.map (R.pipe (
    R.zip (columnsConfig),
    R.map (([config, column]) => MiscUtils.abbreviateColumnContent (config, column)),
  )) (rows)
  view.children[0].setData ({
    headers: R.pluck ('label', columnsConfig),
    data,
  })

  // ... ... footer
  // TODO: move to updateTableFooter
  if (_footer) {
    const footerView = view.children[3] // TODO: do this better
    const footerViewColumns = footerView.children[0].children // TODO: do this better

    R.addIndex (R.forEach) ((config, i) => {
      const { key } = config
      footerViewColumns[i].content = R.propOr ('', key, footer)
    }, columnsConfig)

    parent.render ()
  }
}

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, theme, rows, columnsConfig, isFocused, footer }) => {
  // defaults
  const _footer = R.ifElse (R.isNil, R.always (null), R.identity) (footer)

  // styles
  const defaultTheme = themes[defaultThemeName]
  const styleTable = buildStyleTable (theme, defaultTheme)

  // calculations
  const tableHeight = R.clamp (1, 14, rows.length + 4)
  const columnWidths = R.pluck ('width', columnsConfig)
  const columnTotalWidth = R.sum (columnWidths)

  // views
  const view = blessed.box ()

  const table = contrib.table (R.mergeDeepRight (
    styleTable,
    {
      keys: true,
      interactive: isFocused,
      top: 0,
      left: 0,
      right: 0,
      height: tableHeight,
      width: '100%',
      columnSpacing: 1,
      columnWidth: columnWidths,
    },
  ))

  const _line = line (parent, themes[THEME_GREY], '0')

  const { view: headerLineView } = _line ({ top: 1 })
  const { view: footerLineView } = _line ({ top: tableHeight - 2 })

  view.append (table)
  view.append (headerLineView)
  // view.append (footerLineView)

  if (_footer) {
    const { view: footerView } = buildTableFooter (parent, theme, footer, columnsConfig)
    const footerWrapperView = blessed.box ({
      left: 1,
      top: tableHeight - 1,
      width: columnTotalWidth,
    })

    footerWrapperView.append (footerView)
    view.append (footerWrapperView)
  }

  const data = R.map (R.pipe (
    R.zip (columnsConfig),
    R.map (([config, column]) => R.pipe (
      R.ifElse (R.isNil) (R.always('')) (R.identity),
      MiscUtils.formatColumnContent (config),
      MiscUtils.abbreviateColumnContent (config),
    ) (column)),
  )) (rows)
  table.setData ({
    headers: R.pluck ('label', columnsConfig),
    data,
  })

  // ... attach update
  view.update = update (view)

  return { view, table, data: { height: tableHeight } }
}

module.exports = init
