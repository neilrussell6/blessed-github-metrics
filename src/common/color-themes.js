const R = require ('ramda')

const THEME_GREY = 'grey'
const THEME_DEEP_SEA = 'deep-sea'
const THEME_SPACE_TERM = 'space-term'
const THEME_CRIMSON = 'crimson'

const themes = {
  [THEME_GREY]: {
    '0': 237,
    '1': 238,
    '2': 240,
    '3': 242,
    '3_faded': 242,
    '4': 244,
    '4_faded': 244,
    '5': 246,
    '6': 250,
    '7': 254,
  },
  [THEME_DEEP_SEA]: {
    '0': 23,
    '1': 23,
    '2': 30,
    '3': 37,
    '3_faded': 37,
    '4': 44,
    '4_faded': 73,
    '5': 80,
    '6': 159,
    '7': 195,
  },
  [THEME_SPACE_TERM]: {
    '0': 64,
    '1': 64,
    '2': 106,
    '3': 154,
    '3_faded': 150,
    '4': 191,
    '4_faded': 2,
    '5': 193,
    '6': 193,
    '7': 255,
  },
  [THEME_CRIMSON]: {
    '0': 52,
    '1': 88,
    '2': 124,
    '3': 160,
    '3_faded': 196,
    '4': 1,
    '4_faded': 9,
    '5': 172,
    '6': 220,
    '7': 239,
  },
}

const themeName = R.propOr (THEME_SPACE_TERM, 'COLOR_THEME', process.env)
const THEME_DEFAULT = themeName

module.exports = {
  THEME_GREY,
  THEME_DEEP_SEA,
  THEME_SPACE_TERM,
  THEME_CRIMSON,
  themeName: themeName, // TODO: phase out in favour of THEME_DEFAULT
  theme: themes[themeName], // TODO: phase out in favour of THEME
  themes, // TODO: phase out in favour of THEMES
  THEME_DEFAULT,
  THEMES: {
    'GREY': themes[THEME_GREY],
    'DEEP_SEA': themes[THEME_DEEP_SEA],
    'SPACE_TERM': themes[THEME_SPACE_TERM],
    'CRIMSON': themes[THEME_CRIMSON],
    'DEFAULT': themes[THEME_DEFAULT],
  },
}
