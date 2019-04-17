class BaseMode {
  constructor (data, message) {
    if (typeof data === 'string') {
      this.message = data
      data = null
      message = null
    }
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

class SussessModel extends BaseMode {
  constructor (data, message) {
    super(data, message)
    this.code = 0
  }
}

class ErrorModel extends BaseMode {
  constructor (data, message) {
    super(data, message)
    this.code = 1
  }
}

module.exports = {
  SussessModel,
  ErrorModel
}
