const R = require ('ramda')

const connect = require ('../../common/redux/connect.js')
const Component = require ('./component.js')
const selector = require ('./selector.js')

const mapStateToProps = selector

const mapDispatchToProps = R.always ({})

module.exports = store => connect (store) (
  mapStateToProps,
  mapDispatchToProps,
) (Component)
