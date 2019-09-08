const blessed = require ('blessed')

const Common = require ('../../common/components')
const { Component: PullRequests } = require ('../PullRequests')
const { Component: Message } = require ('../Message')

// --------------------------------------
// state
// --------------------------------------

let state = {}

// --------------------------------------
// init
// --------------------------------------

const init = ({ store, parent, onNavigate }) => {
  const view = blessed.box ({})

  const heading = blessed.box (Common.heading ({ content: ' GITHUB METRICS' }))
  view.append (heading)

  const { view: pullRequestsView, data: pullRequestsData } = PullRequests (store) (parent)
  const { view: messageView, data: messageViewData } = Message (store) (parent)

  // ... view
  // ... ... pull requests
  const pullRequestsWrapperView = blessed.box ({
    left: 'center',
    top: 4,
    height: pullRequestsData.height,
    width: '100%-20',
  })
  pullRequestsWrapperView.append (pullRequestsView)
  view.append ( pullRequestsWrapperView)

  // ... ... message
  const messageWrapperView = blessed.box ({
    left: 0,
    top: 10,
    height: messageViewData,
    width: '100%',
  })
  messageWrapperView.append (messageView)
  view.append (messageWrapperView)

  // ... state
  state.pullRequestsView = pullRequestsView

  // ... events
  parent.screen.key (['S-up'], (ch, key) => {
    onNavigate (0)
  })

  parent.screen.key (['S-down'], (ch, key) => {
    onNavigate (1)
  })

  return { view }
}

module.exports.init = init

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ selectedSectionIndex }) => {
  // TODO: make this dynamic
  state.accountsView.top = selectedSectionIndex === 0 ? 0 : -6
}

module.exports.update = update
