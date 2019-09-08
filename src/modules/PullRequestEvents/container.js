const connect = require ('../../common/redux/connect')
const Component = require ('./component')
const selector = require ('./selector.js')
const { actionCreators } = require ('./reducer')

const { focusPullRequestEvent } = actionCreators

const mapStateToProps = selector

const mapDispatchToProps = dispatch => ({
  onNavigate: index => dispatch (focusPullRequestEvent (index)),
})

module.exports = store => connect (store) (
  mapStateToProps,
  mapDispatchToProps,
) (Component)
