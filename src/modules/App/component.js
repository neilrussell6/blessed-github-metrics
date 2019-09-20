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

const init = ({ store, parent, onNavigate, onToggleNavigate }) => {
  const view = blessed.box ({})

  const heading = blessed.box (Common.heading ({ content: ' GITHUB METRICS' }))
  view.append (heading)

  const { view: pullRequestsView } = PullRequests (store) (parent)
  const { view: pullRequestEventsView } = PullRequestEvents (store) (parent)
  const { view: messageView, data: messageViewData } = Message (store) (parent)

  const { height: messageViewHeight } = messageViewData
  const unfocusedSectionHeight = 10
  const pullRequestsTopOffset = 4
  const pullRequestsHeightAdjustment = pullRequestsTopOffset + 2 + unfocusedSectionHeight + messageViewHeight

  // ... view
  // ... ... pull requests
  const pullRequestsWrapperView = blessed.box ({
    left: 'center',
    top: pullRequestsTopOffset,
    height: `100%-${pullRequestsHeightAdjustment}`,
    width: '100%-20',
  })
  pullRequestsWrapperView.append (pullRequestsView)
  view.append (pullRequestsWrapperView)

  // ... ... pull request events
  const pullRequestEventsWrapperView = blessed.box ({
    left: 'center',
    bottom: messageViewHeight + 1,
    height: unfocusedSectionHeight,
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
  state.pullRequestsTopOffset = pullRequestsTopOffset
  state.unfocusedSectionHeight = unfocusedSectionHeight
  state.messageViewHeight = messageViewHeight
  state.pullRequestsWrapperView = pullRequestsWrapperView
  state.pullRequestsView = pullRequestsView
  state.pullRequestEventsWrapperView = pullRequestEventsWrapperView
  state.pullRequestEventsView = pullRequestEventsView

  // ... events
  // parent.screen.key (['S-up'], (ch, key) => {
  //   onNavigate (0)
  // })
  //
  // parent.screen.key (['S-down'], (ch, key) => {
  //   onNavigate (1)
  // })

  parent.screen.key (['tab'], (ch, key) => {
    onToggleNavigate ()
  })

  return { view }
}

module.exports.init = init

// --------------------------------------
// update
// --------------------------------------

const update = view => ({ selectedSectionIndex }) => {
  const pullRequestsHeightAdjustment = state.pullRequestsTopOffset + 2 + state.unfocusedSectionHeight + state.messageViewHeight

  if (selectedSectionIndex === 0) {
    state.pullRequestsWrapperView.height = `100%-${pullRequestsHeightAdjustment}`
    state.pullRequestEventsWrapperView.height = state.unfocusedSectionHeight
  }
  if (selectedSectionIndex === 1) {
    state.pullRequestsWrapperView.height = state.unfocusedSectionHeight
    state.pullRequestEventsWrapperView.height = `100%-${pullRequestsHeightAdjustment}`
  }
}

module.exports.update = update
