//---------------------------------
// HTTP
//---------------------------------

function HTTPError() {
  this.message = HTTP_ERROR_MESSAGE
  this.name = HTTP_ERROR
  Error.captureStackTrace (this, HTTPError)
}
HTTPError.prototype = Object.create (Error.prototype)
HTTPError.prototype.constructor = HTTPError

module.exports.HTTPError = HTTPError

//---------------------------------
// HTTP Connection
//---------------------------------

function HTTPConnectionError() {
  this.message = HTTP_CONNECTION_ERROR_MESSAGE
  this.name = HTTP_CONNECTION_ERROR
  Error.captureStackTrace (this, HTTPConnectionError)
}
HTTPConnectionError.prototype = Object.create (Error.prototype)
HTTPConnectionError.prototype.constructor = HTTPConnectionError

module.exports.HTTPConnectionError = HTTPConnectionError

//---------------------------------
// error map
//---------------------------------

module.exports.errorMap = {
  ENOTFOUND: HTTPConnectionError,
}
