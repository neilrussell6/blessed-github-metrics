const R = require ('ramda')

// --------------------------------------
// build style box
// --------------------------------------

const buildStyleBox = (theme) => ({
  style: {
    // bg: 0,
    fg: theme['1'],
    label: {
      // bg: 0,
      fg: theme['2'],
    },
  },
})

module.exports.buildStyleBox = buildStyleBox

// --------------------------------------
// build highlight style box
// --------------------------------------

const buildHighlightStyleBox = (theme, highlightTheme) => ({
  style: {
    // bg: 0,
    fg: theme['6'],
    bold: true,
    // label: {
    //   bg: theme['2'],
    //   fg: 0,
    // },
  },
})

module.exports.buildHighlightStyleBox = buildHighlightStyleBox

// --------------------------------------
// build style border box
// --------------------------------------

const buildStyleBorderBox = (theme) => R.mergeDeepRight (
  buildStyleBox (theme),
  {
    border: {
      type: 'line',
    },
    style: {
      border: {
        // bg: 0,
        fg: theme['1'],
      },
    },
  },
)

module.exports.buildStyleBorderBox = buildStyleBorderBox

// --------------------------------------
// build style dark box
// --------------------------------------

const buildStyleDarkBox = theme => R.pipe (
  buildStyleBox,
  R.assocPath (['style', 'fg'], 237),
  // R.assocPath (['style', 'fg'], theme['1']),
  R.assocPath (['style', 'border', 'fg'], theme['1']),
  R.assocPath (['style', 'label', 'fg'], theme['1']),
) (theme)

module.exports.buildStyleDarkBox = buildStyleDarkBox

// --------------------------------------
// build style faded border box
// --------------------------------------

const buildStyleFadedBorderBox = theme => R.pipe (
  buildStyleBorderBox,
  R.assocPath (['style', 'border', 'fg'], theme['4_faded']),
  R.assocPath (['style', 'label', 'fg'], theme['4_faded']),
) (theme)

module.exports.buildStyleFadedBorderBox = buildStyleFadedBorderBox

// --------------------------------------
// build style dark border box
// --------------------------------------

const buildStyleDarkBorderBox = theme => R.pipe (
  buildStyleBorderBox,
  R.assocPath (['style', 'border', 'fg'], theme['1']),
  R.assocPath (['style', 'label', 'fg'], theme['4_faded']),
) (theme)

module.exports.buildStyleDarkBorderBox = buildStyleDarkBorderBox

// --------------------------------------
// build style table
// --------------------------------------

const buildStyleTable = (theme, highlightTheme) => ({
  bg: 0,
  fg: theme['4_faded'],
  selectedBg: 234,
  selectedFg: highlightTheme['4'],
})

module.exports.buildStyleTable = buildStyleTable

// --------------------------------------
// build style heading
// --------------------------------------

const buildStyleHeading = (theme) => ({
  border: {
    type: 'line',
  },
  style: {
    bg: 234,
    fg: theme['4_faded'],
    border: {
      bg: 234,
      fg: theme['4_faded'],
    },
  },
})

module.exports.buildStyleHeading = buildStyleHeading
