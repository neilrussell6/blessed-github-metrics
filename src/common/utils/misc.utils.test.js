const { assert } = require ('chai')
const parametrize = require ('js-parametrize')
const moment = require ('moment-timezone')

const SUT = require ('./misc.utils')
const { FORMATS } = require ('../components/table')

describe ('misc.utils', () => {
  beforeEach (async () => {
    moment.tz.setDefault ('UTC')
  })

  afterEach (async () => {
    moment.tz.setDefault ()
  })

  describe ('abbreviateColumnContent', () => {
    parametrize ([
      [{ width: 8 }, '1234567890', '1234...'],
      [{ width: 8 }, '1234567', '1234567'],
      [{ width: 8 }, '12345', '12345'],
      [{ width: 4 }, '123456', '...'],
      [{ width: 2 }, '123456', '.'],
      [{ width: 1 }, '123456', ''],
    ], (config, content, expected) => {
      it ('should abbreviate column content', () => {
        assert.equal (SUT.abbreviateColumnContent (config) (content), expected)
      })
    })
  })

  describe ('formatColumnContent', () => {
    describe ('date', () => {
      parametrize ([
        ['MM/DD', '', ''],
        ['MM/DD', '2019-09-07T09:50:10Z', '09/07'],
        ['MM/DD HH:mm', '2019-09-07T09:50:10Z', '09/07 09:50'],
      ], (formatTemplate, content, expected) => {
        it ('should abbreviate column content', () => {
          assert.equal (SUT.formatColumnContent ({ format: FORMATS.DATE, formatTemplate }) (content), expected)
        })
      })
    })
  })
})
