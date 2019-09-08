const R = require ('ramda')
const moment = require ('moment')

//---------------------------------
// pad mid
//---------------------------------

const padMid = width => sub => x => {
  const mid = parseInt (width / 2) - 1
  const ellipsis = R.compose (R.join (''), R.repeat (sub)) (3)
  return `${R.slice (0) (mid - 2) (x)}${ellipsis}${R.slice (mid + 1) (Infinity) (x)}`
}

//---------------------------------
// ellipsis transformers
//---------------------------------

const ellipsisTransformers = {
  start: width => x => x.padStart (width, '.'),
  middle: width => x => padMid (width) ('.') (x),
  end: width => x => x.padEnd (width, '.'),
}

//---------------------------------
// abbreviate column content
//---------------------------------

module.exports.abbreviateColumnContent = config => column => {
  const width = R.compose (
    R.subtract (R.__, 1),
    R.propOr (2) ('width'),
  ) (config)
  const ellipsisTransformer = R.compose (
    R.prop (R.__, ellipsisTransformers),
    R.propOr ('end') ('ellipsis'),
  ) (config)
  return R.ifElse (
    R.compose (R.gt (R.__, width), R.length),
    R.pipe (
      R.take (R.clamp (0) (width) (R.subtract (width, 3))),
      ellipsisTransformer (width),
    ),
    R.identity,
  ) (column)
}

//---------------------------------
// format column content
//---------------------------------

module.exports.formatColumnContent = config => column => R.ifElse (
  R.propEq ('format') ('date'),
  R.compose (x => moment (column).format (x), R.propOr ('YYYY-MM-DD') ('formatTemplate')),
  R.always (column),
) (config)
