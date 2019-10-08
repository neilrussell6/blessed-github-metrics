const R = require ('ramda')

//---------------------------------
// set participant is responsible
//---------------------------------

const setParticipantIsResponsible = event => participant => {
  const responsibilityEvents = R.compose (R.propOr ([]) ('responsibilityEvents')) (participant)
  const eventDatetime = R.prop ('at') (event)
  const _responsibilityEvents = R.ifElse (
    // ... if no events, or latest event already has an end datetime set
    R.anyPass ([
      R.isEmpty,
      R.compose (R.not, R.propSatisfies (R.isNil) ('end'), R.last),
    ]),
    // ... then create initial event
    R.append ({ start: eventDatetime, end: null }),
    // ... otherwise do nothing
    R.identity,
  ) (responsibilityEvents)
  return R.mergeDeepLeft ({
    isResponsible: true,
    responsibilityEvents: _responsibilityEvents,
  }) (participant)
}

module.exports.setParticipantIsResponsible = setParticipantIsResponsible

//---------------------------------
// set participant is not responsible
//---------------------------------

const setParticipantIsNotResponsible = event => participant => {
  const responsibilityEvents = R.compose (R.propOr ([]) ('responsibilityEvents')) (participant)
  const lastIndex = R.compose (R.subtract (R.__, 1), R.length) (responsibilityEvents)
  const eventDatetime = R.prop ('at') (event)
  const _responsibilityEvents = R.ifElse (
    // ... if no events, or latest event already has an end datetime set
    R.anyPass ([
      R.isEmpty,
      R.compose (R.not, R.propSatisfies (R.isNil) ('end'), R.last),
    ]),
    // ... then do nothing
    R.identity,
    // ... otherwise set end datetime
    R.adjust (lastIndex) (R.assoc ('end', eventDatetime)),
  ) (responsibilityEvents)
  return R.mergeDeepLeft ({
    isResponsible: false,
    responsibilityEvents: _responsibilityEvents,
  }) (participant)
}

module.exports.setParticipantIsNotResponsible = setParticipantIsNotResponsible
