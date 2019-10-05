module.exports.FORMAT_TEMPLATES = {
  DATE: 'MM/DD HH:mm',
}

//---------------------------------
// event types
//---------------------------------

const EVENT_TYPE_PULL_REQUEST_COMMIT = 'PullRequestCommit'
const EVENT_TYPE_REVIEW_REQUESTED_EVENT = 'ReviewRequestedEvent'
const EVENT_TYPE_REVIEW_DISMISSED_EVENT = 'ReviewDismissedEvent'
const EVENT_TYPE_REVIEW_REQUEST_REMOVED_EVENT = 'ReviewRequestRemovedEvent'
const EVENT_TYPE_PULL_REQUEST_REVIEW = 'PullRequestReview'
const EVENT_TYPE_HEAD_REF_DELETED_EVENT = 'HeadRefDeletedEvent'
const EVENT_TYPE_MERGED_EVENT = 'MergedEvent'
const EVENT_TYPE_CLOSED_EVENT = 'ClosedEvent'
const EVENT_TYPE_ASSIGNED_EVENT = 'AssignedEvent'
const EVENT_TYPE_UNASSIGNED_EVENT = 'UnassignedEvent'

const eventTypes = {
  PULL_REQUEST_COMMIT: EVENT_TYPE_PULL_REQUEST_COMMIT,
  REVIEW_REQUESTED_EVENT: EVENT_TYPE_REVIEW_REQUESTED_EVENT,
  REVIEW_DISMISSED_EVENT: EVENT_TYPE_REVIEW_DISMISSED_EVENT,
  REVIEW_REQUEST_REMOVED_EVENT: EVENT_TYPE_REVIEW_REQUEST_REMOVED_EVENT,
  PULL_REQUEST_REVIEW: EVENT_TYPE_PULL_REQUEST_REVIEW,
  MERGED_EVENT: EVENT_TYPE_MERGED_EVENT,
  HEAD_REF_DELETED_EVENT: EVENT_TYPE_HEAD_REF_DELETED_EVENT,
  CLOSED_EVENT: EVENT_TYPE_CLOSED_EVENT,
  ASSIGNED_EVENT: EVENT_TYPE_ASSIGNED_EVENT,
  UNASSIGNED_EVENT: EVENT_TYPE_UNASSIGNED_EVENT,
}

module.exports.eventTypes = eventTypes

//---------------------------------
// pull request states
//---------------------------------

const PULL_REQUEST_REVIEW_STATE_COMMENTED = 'COMMENTED'
const PULL_REQUEST_REVIEW_STATE_APPROVED = 'APPROVED'
const PULL_REQUEST_REVIEW_STATE_DISMISSED = 'DISMISSED'
const PULL_REQUEST_REVIEW_STATE_CHANGES_REQUESTED = 'CHANGES_REQUESTED'

const pullRequestReviewStates = {
  COMMENTED: PULL_REQUEST_REVIEW_STATE_COMMENTED,
  APPROVED: PULL_REQUEST_REVIEW_STATE_APPROVED,
  DISMISSED: PULL_REQUEST_REVIEW_STATE_DISMISSED,
  CHANGES_REQUESTED: PULL_REQUEST_REVIEW_STATE_CHANGES_REQUESTED,
}

module.exports.pullRequestReviewStates = pullRequestReviewStates

//---------------------------------
// event type to label map
//---------------------------------

const eventTypeToLabelMap = {
  [eventTypes.PULL_REQUEST_COMMIT]: 'COMMIT',
  [eventTypes.HEAD_REF_DELETED_EVENT]: 'DELETED BRANCH',
  [eventTypes.MERGED_EVENT]: 'MERGED',
  [eventTypes.CLOSED_EVENT]: 'CLOSED',
  [`${eventTypes.PULL_REQUEST_REVIEW}__${pullRequestReviewStates.APPROVED}`]: 'REVIEW :: APPROVED',
  [`${eventTypes.PULL_REQUEST_REVIEW}__${pullRequestReviewStates.DISMISSED}`]: 'REVIEW :: DISMISSED',
  [`${eventTypes.PULL_REQUEST_REVIEW}__${pullRequestReviewStates.COMMENTED}`]: 'REVIEW :: COMMENTED',
  [`${eventTypes.PULL_REQUEST_REVIEW}__${pullRequestReviewStates.CHANGES_REQUESTED}`]: 'REVIEW :: CHANGES REQUESTED',
  [eventTypes.REVIEW_REQUESTED_EVENT]: 'REVIEW REQUESTED',
  [eventTypes.REVIEW_DISMISSED_EVENT]: 'REVIEW DISMISSED',
  [eventTypes.REVIEW_REQUEST_REMOVED_EVENT]: 'REVIEW REQUEST REVOKED',
  [eventTypes.ASSIGNED_EVENT]: 'PR ASSIGNED',
  [eventTypes.UNASSIGNED_EVENT]: 'PR UNASSIGNED',
}

module.exports.eventTypeToLabelMap = eventTypeToLabelMap

//---------------------------------
// participant roles
//---------------------------------

const PARTICIPANT_ROLE_AUTHOR = 'AUTHOR'
const PARTICIPANT_ROLE_REVIEWER = 'REVIEWER'

const participantRoles = {
  AUTHOR: PARTICIPANT_ROLE_AUTHOR,
  REVIEWER: PARTICIPANT_ROLE_REVIEWER,
}

module.exports.participantRoles = participantRoles
