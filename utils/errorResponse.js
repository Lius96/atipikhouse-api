class ErrorResponse extends Error {
  constructor(message, messageWithField = null) {
    super(message);
    this.messageWithField = messageWithField;
  }
}

module.exports = ErrorResponse;
