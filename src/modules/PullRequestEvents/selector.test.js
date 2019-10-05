const { assert } = require ('chai')
const parametrize = require ('js-parametrize')

const factory = require ('../../common/factories')
const Settings = require ('../../config/settings')
const SUT = require ('./selector')

describe ('modules/PullRequestEvents/selector', () => {
  describe ('pullRequestEvents', () => {
    it ('should return all pull request events from state', () => {
      const state = {
        pullRequestEvents: [
          { id: 'PULL REQUEST 1 EVENT 1', participants: [] },
        ],
      }
      const result = SUT.pullRequestEventsSelector (state)
      assert.equal (result.pullRequestEvents.length, 1)
      assert.equal (result.pullRequestEvents[0].id, 'PULL REQUEST 1 EVENT 1')
    })

    it ('should build responsible user from participants as expected', async () => {
      const participant1 = await factory.build ('PullRequestParticipant', { login: 'P1', isResponsible: true })
      const participant2 = await factory.build ('PullRequestParticipant', { login: 'P2', isResponsible: false })
      const participant3 = await factory.build ('PullRequestParticipant', { login: 'P3', isResponsible: true })
      const state = {
        pullRequestEvents: [
          { participants: [ participant1, participant2, participant3 ] },
        ],
      }
      const result = SUT.pullRequestEventsSelector (state)
      assert.equal (result.pullRequestEvents[0].responsibleParticipants, 'P1, P3')
    })
  })

  describe ('isFocused', () => {
    parametrize ([
      [{ app: { selectedSectionIndex: 0 } }, false],
      [{ app: { selectedSectionIndex: 1 } }, true],
    ], (state, expected) => {
      it ('should return isFocused as expected', () => {
        const result = SUT.isFocusedSelector (state)
        assert.deepEqual (result.isFocused, expected)
      })
    })
  })

  describe ('columnsConfig', () => {
    it ('should return columnsConfig from app settings', () => {
      const state = {}
      const result = SUT.columnsConfigSelector (state)
      assert.deepEqual (result.columnsConfig, Settings.pullRequestEvents.tableColumnsConfig)
    })
  })
})
