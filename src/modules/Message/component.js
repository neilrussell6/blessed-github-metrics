const blessed = require ('blessed')
const R = require ('ramda')

const { buildStyleBox, buildStyleFadedBorderBox } = require ('../../common/styles')
const { themes, THEME_GREY, THEME_CRIMSON } = require ('../../common/color-themes')
const {
  MESSAGE_TYPE_DEFAULT,
  MESSAGE_TYPE_HELP,
  MESSAGE_TYPE_ERROR,
} = require ('./constants')

// --------------------------------------
// constants
// --------------------------------------

const labels = {
  [MESSAGE_TYPE_DEFAULT]: ' HELP ',
  [MESSAGE_TYPE_HELP]: ' HELP ',
  [MESSAGE_TYPE_ERROR]: ' ERROR ',
}

const themeNames = {
  [MESSAGE_TYPE_DEFAULT]: THEME_GREY,
  [MESSAGE_TYPE_HELP]: THEME_GREY,
  [MESSAGE_TYPE_ERROR]: THEME_CRIMSON,
}

// --------------------------------------
// state
// --------------------------------------

let state = {}

// --------------------------------------
// init
// --------------------------------------

const init = ({ parent, type, message }) => {
  const themeName = themeNames[type]
  const theme = themes[themeName]
  const styleBox = buildStyleBox (theme)
  const styleBorderBox = buildStyleFadedBorderBox (theme)

  const view = blessed.box (R.mergeDeepRight (
    {
      width: '100%',
      height: '100%',
      tags: true,
      label: labels[type],
    },
    styleBorderBox,
  ))

  const box = blessed.box (R.mergeDeepRight (
    {
      top: 1,
      left: 3,
      right: 3,
      height: 1,
      content: message,
    },
    R.mergeDeepRight (
      styleBox,
      { style: { fg: theme['2'] } },
    ),
  ))

  view.append (box)

  const wrapperView = blessed.box ({
    height: 3,
    width: '100%',
    tags: true,
    bottom: 0,
    left: 'center',
  })
  wrapperView.append (view)

  // update local state

  state.parent = parent
  state.view = view
  state.box = box

  return { view: wrapperView, data: { height: 3 } }
}

module.exports.init = init

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ parent, type, message }) => {
  const themeName = themeNames[type]
  const theme = themes[themeName]
  const styleBox = buildStyleBox (theme)
  const styleBorderBox = buildStyleFadedBorderBox (theme)

  state.view.setLabel ({ text: labels[type] })

  state.view.style.label.fg = styleBorderBox.style.label.fg
  state.view.style.border.fg = styleBorderBox.style.border.fg

  state.box.content = message

  const boxStyles = R.mergeDeepRight (
    styleBox,
    {
      style: {
        fg: theme['2'],
      },
    },
  )
  state.box.style.fg = boxStyles.style.fg
}

module.exports.update = update
