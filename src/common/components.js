const R = require ('ramda')

const { theme } = require ('./color-themes')
const { buildStyleHeading } = require ('./styles')

const styleHeading = buildStyleHeading (theme)

// --------------------------------------
// screen
// --------------------------------------

const screen = () => ({
  smartCSR: true,
  autoPadding: false,
  terminal: 'xterm-256color',
})

module.exports.screen = screen

// --------------------------------------
// heading
// --------------------------------------

const heading = (extra = {}) => R.mergeDeepRight ({
  height: 4,
  top: -1,
  left: -2,
  right: -2,
  padding: {
    top: 1,
  },
  width: '100%+4',
  ...extra,
}, styleHeading)

module.exports.heading = heading
