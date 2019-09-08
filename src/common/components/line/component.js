const blessed = require ('blessed')
const R = require ('ramda')

// --------------------------------------
// init
// --------------------------------------

const init = (parent, theme, color, params) => {
  const lineParams = R.mergeDeepRight ({
    fg: R.propOr (R.prop ('1') (theme)) (color) (theme)
  }, {
    top: R.propOr (0) ('top') (params),
    width: R.propOr ('100%') ('width') (params),
    left: 0,
    height: 1,
    orientation: 'horizontal',
  })
  const view = blessed.line (lineParams)
  return { view }
}

module.exports = R.curry (init)
