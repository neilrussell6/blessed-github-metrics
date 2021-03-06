const HTTP_ERROR = 'HttpError'
const HTTP_ERROR_MESSAGE = 'HTTP Error'
const HTTP_CONNECTION_ERROR = 'HttpConnectionError'
const HTTP_CONNECTION_ERROR_MESSAGE = 'HTTP Connection Error'

module.exports.HTTP_ERROR = HTTP_ERROR
module.exports.HTTP_ERROR_MESSAGE = HTTP_ERROR_MESSAGE
module.exports.HTTP_CONNECTION_ERROR = HTTP_CONNECTION_ERROR
module.exports.HTTP_CONNECTION_ERROR_MESSAGE = HTTP_CONNECTION_ERROR_MESSAGE

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
