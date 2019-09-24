const R = require ('ramda')
const { filter } = require ('rxjs/operators')

module.exports.ofTypeMatch = regex => filter (R.compose (R.test (regex), R.prop ('type')))
