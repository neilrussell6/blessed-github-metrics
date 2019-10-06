const { assert } = require ('chai')
const R = require('ramda')
const moment = require('moment')
const parametrize = require('js-parametrize')

const factory = require ('../../common/factories')
const { eventTypes, ignoredEventTypes, pullRequestReviewStates, participantRoles } = require ('./constants')
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
        'type',
        'state',
        'eventLabel',
        'at',
        'authorOrActor',
        'targetUser',
        'delay',
        'participants',
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
      assert.sameMembers (resultLabels, R.reverse ([
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
        'PR ASSIGNED',
      ]))
    })

    it ('should sort by date descending', async () => {
      // when
      // ... we update our state from a http response including
      // ... 5 event types with varying date times
      const state = []
      const datetimeNewest = moment ().toISOString ()
      const datetime2ndNewest = moment ().subtract (1, 'hour').toISOString ()
      const datetime2ndOldest = moment ().subtract (1, 'day').toISOString ()
      const datetimeOldest = moment ().subtract (2, 'days').toISOString ()
      const expectedEventLabelOldest = 'REVIEW :: COMMENTED'
      const pullRequestReviewOldest = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.COMMENTED, createdAt: datetimeOldest },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const expectedEventLabel2ndOldest = 'REVIEW :: CHANGES REQUESTED'
      const pullRequestReview2ndOldest = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.CHANGES_REQUESTED, createdAt: datetime2ndOldest },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const expectedEventLabel2ndNewest = 'REVIEW :: DISMISSED'
      const pullRequestReview2ndNewest = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.DISMISSED, createdAt: datetime2ndNewest },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const expectedEventLabelNewest = 'REVIEW :: APPROVED'
      const pullRequestReviewNewest = await factory.build (
        'GithubPullRequestEvent',
        { state: pullRequestReviewStates.APPROVED, createdAt: datetimeNewest },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const { repository } = await repositoryWithEventsFixture ([
        pullRequestReview2ndOldest,
        pullRequestReviewNewest,
        pullRequestReviewOldest,
        pullRequestReview2ndNewest,
      ])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)
      // then ... should return events ordered by date descending
      const resultLabels = R.pluck ('eventLabel') (result)
      assert.equal (resultLabels[0], expectedEventLabelNewest)
      assert.equal (resultLabels[1], expectedEventLabel2ndNewest)
      assert.equal (resultLabels[2], expectedEventLabel2ndOldest)
      assert.equal (resultLabels[3], expectedEventLabelOldest)
    })

    it ('should limit to 2 contiguous commits', async () => {
      // when
      // ... we update our state from a http response including
      // ... multiple contiguous commits in between other events
      const state = []
      const pullRequestCommit1 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 1' } }, pushedDate: moment ().subtract (12, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestReview1 = await factory.build (
        'GithubPullRequestEvent',
        { actor: { login: 'NON-COMMIT 1' }, state: pullRequestReviewStates.COMMENTED, createdAt: moment ().subtract (11, 'hours').toISOString () },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const pullRequestCommit2 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 2' } }, pushedDate: moment ().subtract (10, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit3 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 3' } }, pushedDate: moment ().subtract (9, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestReview2 = await factory.build (
        'GithubPullRequestEvent',
        { actor: { login: 'NON-COMMIT 2' }, state: pullRequestReviewStates.CHANGES_REQUESTED, createdAt: moment ().subtract (8, 'hours').toISOString () },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const pullRequestCommit4 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 4' } }, pushedDate: moment ().subtract (7, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit5 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 5' } }, pushedDate: moment ().subtract (6, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit6 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 6' } }, pushedDate: moment ().subtract (5, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestReview3 = await factory.build (
        'GithubPullRequestEvent',
        { actor: { login: 'NON-COMMIT 3' }, state: pullRequestReviewStates.APPROVED, createdAt: moment ().subtract (4, 'hours').toISOString () },
        { type: eventTypes.PULL_REQUEST_REVIEW },
      )
      const pullRequestCommit7 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 7' } }, pushedDate: moment ().subtract (3, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit8 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 8' } }, pushedDate: moment ().subtract (2, 'hours').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit9 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 9' } }, pushedDate: moment ().subtract (1, 'hour').toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )
      const pullRequestCommit10 = await factory.build (
        'GithubPullRequestEvent',
        { commit: { author: { user: { login: 'COMMIT 10' } }, pushedDate: moment ().toISOString () } },
        { type: eventTypes.PULL_REQUEST_COMMIT },
      )

      const { repository } = await repositoryWithEventsFixture ([
        pullRequestCommit1,
        pullRequestReview1,
        pullRequestCommit2,
        pullRequestCommit3,
        pullRequestReview2,
        pullRequestCommit4,
        pullRequestCommit5,
        pullRequestCommit6,
        pullRequestReview3,
        pullRequestCommit7,
        pullRequestCommit8,
        pullRequestCommit9,
        pullRequestCommit10,
      ])
      const payload = { repository }
      const action = httpGetPullRequestEventsSuccess (payload)
      const result = SUT (state, action)

      // then ... should return events with contiguous events limited to 2
      const resultActors = R.pluck ('authorOrActor') (result)

      assert.equal (resultActors[0], 'COMMIT 10')
      // removed 'COMMIT 9'
      // removed 'COMMIT 8'
      assert.equal (resultActors[1], 'COMMIT 7')
      assert.equal (resultActors[2], 'NON-COMMIT 3')
      assert.equal (resultActors[3], 'COMMIT 6')
      // removed 'COMMIT 5'
      assert.equal (resultActors[4], 'COMMIT 4')
      assert.equal (resultActors[5], 'NON-COMMIT 2')
      assert.equal (resultActors[6], 'COMMIT 3')
      assert.equal (resultActors[7], 'COMMIT 2')
      assert.equal (resultActors[8], 'NON-COMMIT 1')
      assert.equal (resultActors[9], 'COMMIT 1')
    })

    describe ('participants/roles', () => {
      it ('should add initial committer to participants as active author', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event
        const state = []
        const pullRequestInitialCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (12, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestInitialCommit,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)
        const chronologicalResult = R.reverse (result)

        // then ... should have added initial committer as active author
        const participants = R.pluck ('participants') (chronologicalResult)
        const event1Participants = participants[0]
        assert.equal (event1Participants.length, 1)
        assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR, isActive: true })
      })

      it ('should add requested reviewers to participants as reviewers', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event, 2 review requests and an additional commit
        const state = []
        const pullRequestInitialCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (4, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )
        const pullRequestReviewRequest1 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (3, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReviewRequest2 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 3 REVIEWER 2' }, createdAt: moment ().subtract (2, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestAdditionalCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (1, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestInitialCommit,
          pullRequestReviewRequest1,
          pullRequestReviewRequest2,
          pullRequestAdditionalCommit,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)
        const chronologicalResult = R.reverse (result)

        // then
        // ... should have added initial committer as active author
        const participants = R.pluck ('participants') (chronologicalResult)
        // ... author
        const event1Participants = participants[0]
        assert.equal (event1Participants.length, 1)
        assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR })
        // ... author, reviewer1
        const event2Participants = participants[1]
        assert.equal (event2Participants.length, 2)
        assert.include (event2Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR })
        assert.include (event2Participants[1], { login: 'USER 2 REVIEWER 1', role: participantRoles.REVIEWER })
        // ... author, reviewer1, reviewer2
        const event3Participants = participants[2]
        assert.equal (event3Participants.length, 3)
        assert.include (event3Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR })
        assert.include (event3Participants[1], { login: 'USER 2 REVIEWER 1', role: participantRoles.REVIEWER })
        assert.include (event3Participants[2], { login: 'USER 3 REVIEWER 2', role: participantRoles.REVIEWER })
        // ... author, reviewer1, reviewer2
        const event4Participants = participants[3]
        assert.equal (event4Participants.length, 3)
        assert.include (event4Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR })
        assert.include (event4Participants[1], { login: 'USER 2 REVIEWER 1', role: participantRoles.REVIEWER })
        assert.include (event4Participants[2], { login: 'USER 3 REVIEWER 2', role: participantRoles.REVIEWER })
      })

      it ('should add new user as active author when re-assigned and set current active author to inactive', async () => {
        // TODO: test and implement
      })

      it ('should remove reviewers from participants when review is revoked', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event, 2 review requests and a review request removal
        const state = []
        const pullRequestInitialCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (4, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )
        const pullRequestReviewRequest1 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (3, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReviewRequest2 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 3 REVIEWER 2' }, createdAt: moment ().subtract (2, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReviewRequest1Removed = await factory.build (
          'GithubPullRequestEvent',
          {
            actor: { login: 'USER 1 AUTHOR' },
            requestedReviewer: { login: 'USER 2 REVIEWER 1' },
            createdAt: moment ().subtract (1, 'hours').toISOString (),
          },
          { type: eventTypes.REVIEW_REQUEST_REMOVED_EVENT },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestInitialCommit,
          pullRequestReviewRequest1,
          pullRequestReviewRequest2,
          pullRequestReviewRequest1Removed,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)
        const chronologicalResult = R.reverse (result)

        // then
        // ... should have removed reviewer 1 after author removed review request
        const participants = R.pluck ('participants') (chronologicalResult)
        // ... author, reviewer2
        const event4Participants = participants[3]
        assert.equal (event4Participants.length, 2)
        assert.include (event4Participants[0], { login: 'USER 1 AUTHOR', role: participantRoles.AUTHOR })
        assert.include (event4Participants[1], { login: 'USER 3 REVIEWER 2', role: participantRoles.REVIEWER })
      })

      it ('should never otherwise remove a participant', async () => {
        // TODO: test and implement
      })
    })

    describe ('participants/responsibility', () => {
      it ('should assign responsibility to initial committer', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event
        const state = []
        const pullRequestInitialCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (12, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestInitialCommit,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)
        const chronologicalResult = R.reverse (result)

        // then ... should have set initial committer as responsible
        const participants = R.pluck ('participants') (chronologicalResult)
        const event1Participants = participants[0]
        assert.equal (event1Participants.length, 1)
        assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
      })

      parametrize([
        pullRequestReviewStates.CHANGES_REQUESTED,
        pullRequestReviewStates.APPROVED,
      ], (reviewState) => {
        it ('should assign responsibility to single requested reviewer and back to author when reviewer completes review', async () => {
          // when
          // ... we update our state from a http response including
          // ... an initial commit event, a review request, review and an additional commit
          const state = []
          const pullRequestInitialCommit = await factory.build (
            'GithubPullRequestEvent',
            { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (7, 'hours').toISOString () } },
            { type: eventTypes.PULL_REQUEST_COMMIT },
          )
          const pullRequestReviewRequest1 = await factory.build (
            'GithubPullRequestEvent',
            { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (6, 'hours').toISOString () },
            { type: eventTypes.REVIEW_REQUESTED_EVENT },
          )
          const pullRequestReview1ChangesRequested = await factory.build (
            'GithubPullRequestEvent',
            { state: reviewState, author: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (4, 'hours').toISOString () },
            { type: eventTypes.PULL_REQUEST_REVIEW },
          )

          const { repository } = await repositoryWithEventsFixture ([
            pullRequestInitialCommit,
            pullRequestReviewRequest1,
            pullRequestReview1ChangesRequested,
          ])
          const payload = { repository }
          const action = httpGetPullRequestEventsSuccess (payload)
          const result = SUT (state, action)

          // then ... should assign responsibility to single requested reviewer and back to author when reviewer completes review
          const participants = R.compose (R.reverse, R.pluck ('participants')) (result)
          // ... commit : author
          const event1Participants = participants[0]
          assert.equal (event1Participants.length, 1)
          assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
          // ... review request : reviewer1
          const event2Participants = participants[1]
          assert.equal (event2Participants.length, 2)
          assert.include (event2Participants[0], { login: 'USER 1 AUTHOR', isResponsible: false })
          assert.include (event2Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
          // ... review request : author
          const event3Participants = participants[2]
          assert.equal (event3Participants.length, 2)
          assert.include (event3Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
          assert.include (event3Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: false })
        })
      })

      it ('should assign responsibility to multiple requested reviewers and back to author when any reviewer reviews', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event, 2 review requests, then reviews from each reviewer in turn
        const state = []
        const pullRequestInitialCommit = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (7, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )
        const pullRequestReviewRequest1 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (6, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReviewRequest2 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 3 REVIEWER 2' }, createdAt: moment ().subtract (5, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReview1ChangesRequestedByReviewer2 = await factory.build (
          'GithubPullRequestEvent',
          { state: pullRequestReviewStates.CHANGES_REQUESTED, author: { login: 'USER 3 REVIEWER 2' }, createdAt: moment ().subtract (4, 'hours').toISOString () },
          { type: eventTypes.PULL_REQUEST_REVIEW },
        )
        const pullRequestReview2ApprovedByReviewer1 = await factory.build (
          'GithubPullRequestEvent',
          { state: pullRequestReviewStates.APPROVED, author: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (2, 'hours').toISOString () },
          { type: eventTypes.PULL_REQUEST_REVIEW },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestInitialCommit,
          pullRequestReviewRequest1,
          pullRequestReviewRequest2,
          pullRequestReview1ChangesRequestedByReviewer2,
          pullRequestReview2ApprovedByReviewer1,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)

        // then ... should assign responsibility back to author on first review
        const participants = R.compose (R.reverse, R.pluck ('participants')) (result)
        // ... commit : author
        const event1Participants = participants[0]
        assert.equal (event1Participants.length, 1)
        assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        // ... review request of reviewer1: reviewer1
        const event2Participants = participants[1]
        assert.equal (event2Participants.length, 2)
        assert.include (event2Participants[0], { login: 'USER 1 AUTHOR', isResponsible: false })
        assert.include (event2Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
        // ... review request of reviewer2: reviewer1, reviewer2
        const event3Participants = participants[2]
        assert.equal (event3Participants.length, 3)
        assert.include (event3Participants[0], { login: 'USER 1 AUTHOR', isResponsible: false })
        assert.include (event3Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
        assert.include (event3Participants[2], { login: 'USER 3 REVIEWER 2', isResponsible: true })
        // ... review by reviewer2 : author, reviewer1
        const event4Participants = participants[3]
        assert.equal (event4Participants.length, 3)
        assert.include (event4Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        assert.include (event4Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
        assert.include (event4Participants[2], { login: 'USER 3 REVIEWER 2', isResponsible: false })
        // ... review by reviewer1 : author
        const event5Participants = participants[4]
        assert.equal (event5Participants.length, 3)
        assert.include (event5Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        assert.include (event5Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: false })
        assert.include (event5Participants[2], { login: 'USER 3 REVIEWER 2', isResponsible: false })
      })

      it ('should reassign responsibility back to reviewers on re-review request', async () => {
        // when
        // ... we update our state from a http response including
        // ... an initial commit event, a review requests,
        // ... then a review from that reviewer,
        // ... then an additional commit and a re-review request
        const state = []
        const pullRequestCommit1 = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (5, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )
        const pullRequestReviewRequest1 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (4, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )
        const pullRequestReview1ChangesRequestedByReviewer1 = await factory.build (
          'GithubPullRequestEvent',
          { state: pullRequestReviewStates.CHANGES_REQUESTED, author: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (3, 'hours').toISOString () },
          { type: eventTypes.PULL_REQUEST_REVIEW },
        )
        const pullRequestCommit2 = await factory.build (
          'GithubPullRequestEvent',
          { commit: { author: { user: { login: 'USER 1 AUTHOR' } }, pushedDate: moment ().subtract (2, 'hours').toISOString () } },
          { type: eventTypes.PULL_REQUEST_COMMIT },
        )
        const pullRequestReviewRequest2 = await factory.build (
          'GithubPullRequestEvent',
          { requestedReviewer: { login: 'USER 2 REVIEWER 1' }, createdAt: moment ().subtract (1, 'hours').toISOString () },
          { type: eventTypes.REVIEW_REQUESTED_EVENT },
        )

        const { repository } = await repositoryWithEventsFixture ([
          pullRequestCommit1,
          pullRequestReviewRequest1,
          pullRequestReview1ChangesRequestedByReviewer1,
          pullRequestCommit2,
          pullRequestReviewRequest2,
        ])
        const payload = { repository }
        const action = httpGetPullRequestEventsSuccess (payload)
        const result = SUT (state, action)

        // then ... should assign responsibility back to author on first review
        const participants = R.compose (R.reverse, R.pluck ('participants')) (result)
        // ... commit : author
        const event1Participants = participants[0]
        assert.equal (event1Participants.length, 1)
        assert.include (event1Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        // ... review request of reviewer1: reviewer1
        const event2Participants = participants[1]
        assert.equal (event2Participants.length, 2)
        assert.include (event2Participants[0], { login: 'USER 1 AUTHOR', isResponsible: false })
        assert.include (event2Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
        // ... review by reviewer1 : author
        const event3Participants = participants[2]
        assert.equal (event3Participants.length, 2)
        assert.include (event3Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        assert.include (event3Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: false })
        // ... commit by author: author
        const event4Participants = participants[3]
        assert.equal (event4Participants.length, 2)
        assert.include (event4Participants[0], { login: 'USER 1 AUTHOR', isResponsible: true })
        assert.include (event4Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: false })
        // ... re-review request of reviewer1: reviewer1
        const event5Participants = participants[4]
        assert.equal (event5Participants.length, 2)
        assert.include (event5Participants[0], { login: 'USER 1 AUTHOR', isResponsible: false })
        assert.include (event5Participants[1], { login: 'USER 2 REVIEWER 1', isResponsible: true })
      })

      it ('should remove author from responsibility when pull request is closed or deleted', async () => {
        // TODO: test and implement
      })

      it ('should remove reviewer from responsibility when pull request is closed or deleted', async () => {
        // TODO: test and implement
      })

      it ('should change author responsibility when pull request is re-assigned', async () => {
        // TODO: test and implement
      })
    })

    it ('should set delay to ... ?', async () => {
      // TODO: test and implement
    })
  })
})
