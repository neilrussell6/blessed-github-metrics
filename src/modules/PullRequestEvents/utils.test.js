const { assert } = require('chai')

const SUT = require('./utils')

describe ('modules/PullRequestEvents/utils', () => {
  describe ('setParticipantIsResponsible', () => {
    it ('should set as responsible', () => {
      const event = {}
      const participant = {}
      const result = SUT.setParticipantIsResponsible (event) (participant)
      assert.isTrue (result.isResponsible)
    })
  })

  describe ('setParticipantIsNotResponsible', () => {
    it ('should set as not responsible', () => {
      const event = {}
      const participant = {}
      const result = SUT.setParticipantIsNotResponsible (event) (participant)
      assert.isFalse (result.isResponsible)
    })
  })
})
