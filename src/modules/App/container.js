const connect = require ('../../common/redux/connect.js')
const Component = require ('./component.js')
const selector = require ('./selector.js')
const { actionCreators } = require ('./reducer')

const { focusSection, toggleFocusSection } = actionCreators

const mapStateToProps = selector

const mapDispatchToProps = dispatch => ({
  onNavigate: index => dispatch (focusSection (index)),
  onToggleNavigate: () => dispatch (toggleFocusSection ()),
})

module.exports = store => connect (store) (
  mapStateToProps,
  mapDispatchToProps,
) (Component)
