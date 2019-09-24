const { marbles } = require ('rxjs-marbles/mocha')

const SUT = require ('./epics')
const { setErrorMessage } = require ('./reducer')

describe ('modules/Message/epics', () => {
  describe ('setErrorMessageEpic', () => {
    it ('should set error message on any failure action', marbles ((m) => {
      // given ...
      const values = {
        a: { type: 'ANY_FAILURE', payload: 'FAILURE MESSAGE' },
        b: setErrorMessage ('FAILURE MESSAGE'),
      }
      const action$  = m.cold ('---a---', values)
      const expected =         '---b---'

      // when ... something fails
      // then ... should set message expected
      const destination$ = SUT.setErrorMessageEpic (action$)
      m.equal (destination$, expected, values)
    }))
  })
})


