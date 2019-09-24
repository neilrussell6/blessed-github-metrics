const { assert } = require ('chai')
const R = require('ramda')

const factory = require ('../../common/factories')
const { eventTypes, ignoredEventTypes, pullRequestReviewStates } = require ('./constants')
const { reducer: SUT, httpGetPullRequestEventsSuccess } = require ('./reducer')

const repositoryWithEventsFixture = async events => ({
  repository: {
    pullRequests: {
      nodes: [
        {
          timelineItems: {
            nodes: events,
          }
        },
      ],
    },
  },
})

const repositoryWithAllEventsFixture = async () => {
  const pullRequestCommit = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.PULL_REQUEST_COMMIT })
  const reviewRequestedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUESTED_EVENT })
  const reviewDismissedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_DISMISSED_EVENT })
  const reviewRequestRemovedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUEST_REMOVED_EVENT })
  const pullRequestReviewApproved = await factory.build (
    'GithubPullRequestEvent',
    { state: pullRequestReviewStates.APPROVED },
    { type: eventTypes.PULL_REQUEST_REVIEW },
  )
  const pullRequestReviewCommented = await factory.build (
    'GithubPullRequestEvent',
    { state: pullRequestReviewStates.COMMENTED },
    { type: eventTypes.PULL_REQUEST_REVIEW },
  )
  const pullRequestReviewDismissed = await factory.build (
    'GithubPullRequestEvent',
    { state: pullRequestReviewStates.DISMISSED },
    { type: eventTypes.PULL_REQUEST_REVIEW },
  )
  const pullRequestReviewChangesRequested = await factory.build (
    'GithubPullRequestEvent',
    { state: pullRequestReviewStates.CHANGES_REQUESTED },
    { type: eventTypes.PULL_REQUEST_REVIEW },
  )
  const mergedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.MERGED_EVENT })
  const deletedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.HEAD_REF_DELETED_EVENT })
  const closedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.CLOSED_EVENT })
  const assignedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.ASSIGNED_EVENT })
  const { repository } = await repositoryWithEventsFixture ([
    pullRequestCommit,
    reviewRequestedEvent,
    reviewDismissedEvent,
    reviewRequestRemovedEvent,
    pullRequestReviewApproved,
    pullRequestReviewCommented,
    pullRequestReviewDismissed,
    pullRequestReviewChangesRequested,
    mergedEvent,
    deletedEvent,
    closedEvent,
    assignedEvent,
  ])
  return {
    repository,
    pullRequestCommit,
    reviewRequestedEvent,
    reviewDismissedEvent,
    reviewRequestRemovedEvent,
    pullRequestReviewApproved,
    pullRequestReviewCommented,
    pullRequestReviewDismissed,
    pullRequestReviewChangesRequested,
    mergedEvent,
    deletedEvent,
    closedEvent,
    assignedEvent,
  }
}

describe ('modules/PullRequestEvents/reducer', () => {
  describe ('setPullRequestEvents', () => {
    it ('should return all expected fields', async () => {
      // when
      // ... we update our state from a http response including 3 pull request events
      const pullRequestEvents = await factory.buildMany ('GithubPullRequestEvent', 3)
      const state = []
      const { repository } = await repositoryWithEventsFixture (pullRequestEvents)
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should return all events with expected fields
      assert.equal (result.length, 3)
      assert.sameMembers (R.keys (result[0]), [
        'eventLabel',
        'at',
        'authorOrActor',
        'targetUser',
        'delay',
      ])
    })

    it ('should flatten and format commit events as expected', async () => {
      // when
      // ... we update our state from a http response including:
      // ... a commit event
      const pullRequestCommit = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.PULL_REQUEST_COMMIT })
      const state = []
      const { repository } = await repositoryWithEventsFixture ([pullRequestCommit])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should have transformed and mapped commit event as expected
      assert.equal (result.length, 1)
      assert.equal (result[0].eventLabel, 'COMMIT')
      assert.equal (result[0].at, pullRequestCommit.commit.pushedDate)
      assert.equal (result[0].authorOrActor, pullRequestCommit.commit.author.user.login)
      assert.equal (result[0].targetUser, null)
      assert.equal (result[0].delay, null)
    })

    it ('should set author or actor from first available out of those two', async () => {
      // when
      // ... we update our state from a http response including:
      // ... an event with an author.user.login and no actor (PullRequestCommit)
      // ... an event with an author.login and no actor (PullRequestReview)
      // ... an event with an actor.login and no author (ReviewRequestedEvent)
      const pullRequestCommit = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.PULL_REQUEST_COMMIT })
      const pullRequestReview = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.APPROVED },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const reviewRequestedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUESTED_EVENT })
      const state = []
      const { repository } = await repositoryWithEventsFixture ([
        pullRequestCommit,
        pullRequestReview,
        reviewRequestedEvent,
      ])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should set author or actor from first available out of those two
      assert.equal (result.length, 3)
      const pullRequestCommitResult = R.find (R.propEq ('eventLabel') ('COMMIT')) (result)
      assert.equal (pullRequestCommitResult.authorOrActor, pullRequestCommit.commit.author.user.login)
      const pullRequestReviewResult = R.find (R.propEq ('eventLabel') ('REVIEW :: APPROVED')) (result)
      assert.equal (pullRequestReviewResult.authorOrActor, pullRequestReview.author.login)
      const reviewRequestedEventResult = R.find (R.propEq ('eventLabel') ('REVIEW REQUESTED')) (result)
      assert.equal (reviewRequestedEventResult.authorOrActor, reviewRequestedEvent.actor.login)
    })

    it ('should set at date from first available out pushedDate, createdAt and submittedAt', async () => {
      // when
      // ... we update our state from a http response including:
      // ... an event with both pushed and committed dates
      // ... an event with a submitted at date but no others
      // ... an event with a created at date but no others
      const pullRequestCommit = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.PULL_REQUEST_COMMIT })
      const pullRequestReview = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.APPROVED },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const reviewRequestedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUESTED_EVENT })
      const state = []
      const { repository } = await repositoryWithEventsFixture ([
        pullRequestCommit,
        pullRequestReview,
        reviewRequestedEvent,
      ])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should set at date correctly for all events
      assert.equal (result.length, 3)
      const pullRequestCommitResult = R.find (R.propEq ('eventLabel') ('COMMIT')) (result)
      assert.equal (pullRequestCommitResult.at, pullRequestCommit.commit.pushedDate)
      const pullRequestReviewResult = R.find (R.propEq ('eventLabel') ('REVIEW :: APPROVED')) (result)
      assert.equal (pullRequestReviewResult.at, pullRequestReview.submittedAt)
      const reviewRequestedEventResult = R.find (R.propEq ('eventLabel') ('REVIEW REQUESTED')) (result)
      assert.equal (reviewRequestedEventResult.at, reviewRequestedEvent.createdAt)
    })


    it ('should set target user to requested or null if not available', async () => {
      // when
      // ... we update our state from a http response including:
      // ... 2 different events both with requested reviewers
      // ... and an event with no requested reviewers
      const reviewRequestedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUESTED_EVENT })
      const reviewRequestRemovedEvent = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.REVIEW_REQUEST_REMOVED_EVENT })
      const pullRequestCommit = await factory.build ('GithubPullRequestEvent', {}, { type: eventTypes.PULL_REQUEST_COMMIT })
      const state = []
      const { repository } = await repositoryWithEventsFixture ([
        reviewRequestedEvent,
        reviewRequestRemovedEvent,
        pullRequestCommit,
      ])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should set at date correctly for all events
      assert.equal (result.length, 3)
      const reviewRequestedEventResult = R.find (R.propEq ('eventLabel') ('REVIEW REQUESTED')) (result)
      assert.equal (reviewRequestedEventResult.targetUser, reviewRequestedEvent.requestedReviewer.login)
      const reviewRequestRemovedEventResult = R.find (R.propEq ('eventLabel') ('REVIEW REQUEST REVOKED')) (result)
      assert.equal (reviewRequestRemovedEventResult.targetUser, reviewRequestRemovedEvent.requestedReviewer.login)
      const pullRequestCommitResult = R.find (R.propEq ('eventLabel') ('COMMIT')) (result)
      assert.equal (pullRequestCommitResult.targetUser, null)
    })

    it ('should map event type and sometimes state to the expected event label', async () => {
      // when
      // ... we update our state from a http response including all possible event types
      const state = []
      const { repository } = await repositoryWithAllEventsFixture ()
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should map event type and sometimes state to the expected event label
      const resultLabels = R.pluck ('eventLabel') (result)
      assert.sameMembers(resultLabels, R.reverse ([
        'COMMIT',
        'REVIEW REQUESTED',
        'REVIEW DISMISSED',
        'REVIEW REQUEST REVOKED',
        'REVIEW :: APPROVED',
        'REVIEW :: COMMENTED',
        'REVIEW :: DISMISSED',
        'REVIEW :: CHANGES REQUESTED',
        'MERGED',
        'DELETED BRANCH',
        'CLOSED',
        'PR RE-ASSIGNED',
      ]))
    })

    it ('should set delay to ... ?', async () => {
      // TODO: test and implement
    })
  })
})
