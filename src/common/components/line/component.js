const blessed = require ('blessed')
const R = require ('ramda')

const { themes, themeName: defaultThemeName } = require ('../../color-themes')

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, theme, color, params }) => {
  // styles
  const defaultTheme = themes[defaultThemeName]

  // defaults
  const _theme = theme ? theme : defaultTheme
  const _color = color ? color : '1'

  // views
  const lineParams = {
    width: '100%',
    left: 0,
    height: 1,
    orientation: 'horizontal',
    fg: _theme[_color],
    ...params,
  }
  const view = blessed.line (lineParams)
  return { view }
}

module.exports = init
