/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const R = require ('ramda')
const Faker = require ('faker')

const { eventTypes, pullRequestReviewStates } = require('../../modules/PullRequestEvents')
const GenericModel = require('./generic-model')

const PullRequestCommit = ({
  __typename: eventTypes.PULL_REQUEST_COMMIT,
  commit: {
    committedDate: Faker.date.recent,
    pushedDate: Faker.date.recent,
    author: { user: { login: Faker.internet.userName } },
  }
})

const ReviewRequestedEvent = ({
  __typename: eventTypes.REVIEW_REQUESTED_EVENT,
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
  requestedReviewer: { login: Faker.internet.userName },
})

const ReviewRequestRemovedEvent = ({
  __typename: eventTypes.REVIEW_REQUEST_REMOVED_EVENT,
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
  requestedReviewer: { login: Faker.internet.userName },
})

const ReviewDismissedEvent = ({
  __typename: eventTypes.REVIEW_DISMISSED_EVENT,
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
})

const PullRequestReview = ({
  __typename: eventTypes.PULL_REQUEST_REVIEW,
  state: () => Faker.random.objectElement (pullRequestReviewStates),
  submittedAt: Faker.date.recent,
  author: { login: Faker.internet.userName },
})

const MergedEvent = ({
  __typename: eventTypes.MERGED_EVENT,
  mergeRefName: 'develop',
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
})

const HeadRefDeletedEvent = ({
  __typename: eventTypes.HEAD_REF_DELETED_EVENT,
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
})

const ClosedEvent = ({
  __typename: eventTypes.CLOSED_EVENT,
  createdAt: Faker.date.recent,
  actor: { login: Faker.internet.userName },
})

const AssignedEvent = ({
  __typename: eventTypes.ASSIGNED_EVENT,
})

const typeMap = {
  [eventTypes.PULL_REQUEST_COMMIT]: PullRequestCommit,
  [eventTypes.REVIEW_REQUESTED_EVENT]: ReviewRequestedEvent,
  [eventTypes.REVIEW_DISMISSED_EVENT]: ReviewDismissedEvent,
  [eventTypes.REVIEW_REQUEST_REMOVED_EVENT]: ReviewRequestRemovedEvent,
  [eventTypes.PULL_REQUEST_REVIEW]: PullRequestReview,
  [eventTypes.MERGED_EVENT]: MergedEvent,
  [eventTypes.HEAD_REF_DELETED_EVENT]: HeadRefDeletedEvent,
  [eventTypes.CLOSED_EVENT]: ClosedEvent,
  [eventTypes.ASSIGNED_EVENT]: AssignedEvent,
}

module.exports = factory => factory.define ('GithubPullRequestEvent', GenericModel, config => (
  R.ifElse (
    R.has ('type'),
    R.compose (R.prop (R.__, typeMap), R.prop ('type')),
    () => Faker.random.objectElement (typeMap),
  ) (config)
))
