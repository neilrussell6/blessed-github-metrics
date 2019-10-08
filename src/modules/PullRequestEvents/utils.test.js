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

    it ('should create a new responsibility event with start time if none', () => {
      const event = { at: 'EVENT AT'}
      const participant = {}
      const result = SUT.setParticipantIsResponsible (event) (participant)
      assert.deepEqual (result.responsibilityEvents, [
        { start: 'EVENT AT', end: null },
      ])
    })

    it ('should create a new responsibility event with start time if previous event is complete', () => {
      const event = { at: 'EVENT AT'}
      const participant = {
        responsibilityEvents: [
          { start: 'START TIME', end: 'END TIME' },
        ],
      }
      const result = SUT.setParticipantIsResponsible (event) (participant)
      assert.deepEqual (result.responsibilityEvents, [
        { start: 'START TIME', end: 'END TIME' },
        { start: 'EVENT AT', end: null },
      ])
    })
  })

  describe ('setParticipantIsNotResponsible', () => {
    it ('should set as not responsible', () => {
      const event = {}
      const participant = {}
      const result = SUT.setParticipantIsNotResponsible (event) (participant)
      assert.isFalse (result.isResponsible)
    })

    it ('should not create a new responsibility event if none', () => {
      const event = { at: 'EVENT AT'}
      const participant = {}
      const result = SUT.setParticipantIsNotResponsible (event) (participant)
      assert.deepEqual (result.responsibilityEvents, [])
    })

    it ('should complete latest responsibility event setting end time', () => {
      const event = { at: 'EVENT AT'}
      const participant = {
        responsibilityEvents: [
          { start: 'START TIME', end: null },
        ],
      }
      const result = SUT.setParticipantIsNotResponsible (event) (participant)
      assert.deepEqual (result.responsibilityEvents, [
        { start: 'START TIME', end: 'EVENT AT' },
      ])
    })

    it ('should not complete latest responsibility event if already complete', () => {
      const event = { at: 'EVENT AT'}
      const participant = {
        responsibilityEvents: [
          { start: 'START TIME', end: 'END TIME' },
        ],
      }
      const result = SUT.setParticipantIsNotResponsible (event) (participant)
      assert.deepEqual (result.responsibilityEvents, [
        { start: 'START TIME', end: 'END TIME' },
      ])
    })
  })
})
