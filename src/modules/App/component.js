const blessed = require ('blessed')

const Common = require ('../../common/components')
const { Component: PullRequests } = require ('../PullRequests')
const { Component: PullRequestEvents } = require ('../PullRequestEvents')
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

  const { view: pullRequestsView } = PullRequests (store) (parent)
  const { view: pullRequestEventsView } = PullRequestEvents (store) (parent)
  const { view: messageView, data: messageViewData } = Message (store) (parent)

  const { height: messageViewHeight } = messageViewData
  const pullRequestsEventsHeight = 14

  // ... view
  // ... ... pull requests
  const pullRequestsWrapperView = blessed.box ({
    left: 'center',
    top: 4,
    height: `100%-${4+2+pullRequestsEventsHeight+messageViewHeight}`,
    width: '100%-20',
  })
  pullRequestsWrapperView.append (pullRequestsView)
  view.append (pullRequestsWrapperView)

  // ... ... pull request events
  const pullRequestEventsWrapperView = blessed.box ({
    left: 'center',
    bottom: messageViewHeight + 1,
    height: pullRequestsEventsHeight,
    width: '100%-20',
  })
  pullRequestEventsWrapperView.append (pullRequestEventsView)
  view.append (pullRequestEventsWrapperView)

  // ... ... message
  const messageWrapperView = blessed.box ({
    left: 0,
    bottom: 0,
    height: messageViewHeight,
    width: '100%',
  })
  messageWrapperView.append (messageView)
  view.append (messageWrapperView)

  // ... state
  state.pullRequestsView = pullRequestsView
  state.pullRequestEventsView = pullRequestEventsView

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
  state.pullRequestsView.top = selectedSectionIndex === 0 ? 0 : -6
}

module.exports.update = update
