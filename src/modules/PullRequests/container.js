const connect = require ('../../common/redux/connect')
const Component = require ('./component')
const selector = require ('./selector.js')
const { focusPullRequest, selectPullRequest } = require ('../PullRequest')

const mapStateToProps = selector

const mapDispatchToProps = dispatch => ({
  onNavigate: index => dispatch (focusPullRequest (index)),
  onSelect: data => dispatch (selectPullRequest (data)),
})

module.exports = store => connect (store) (
  mapStateToProps,
  mapDispatchToProps,
) (Component)
