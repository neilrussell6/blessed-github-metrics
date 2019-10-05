const R = require ('ramda')

function GenericModel(data) {
  R.compose (R.forEach (([k, v]) => this[k] = v), R.toPairs) (data)
}

module.exports = GenericModel
