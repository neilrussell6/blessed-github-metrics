const R = require ('ramda')

//---------------------------------
// set participant is responsible
//---------------------------------

const setParticipantIsResponsible = event => participant => R.mergeDeepLeft ({ isResponsible: true }) (participant)

module.exports.setParticipantIsResponsible = setParticipantIsResponsible

//---------------------------------
// set participant is not responsible
//---------------------------------

const setParticipantIsNotResponsible = event => participant => R.mergeDeepLeft ({ isResponsible: false }) (participant)

module.exports.setParticipantIsNotResponsible = setParticipantIsNotResponsible
