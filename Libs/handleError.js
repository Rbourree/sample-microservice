class HttpError extends Error {
    constructor (status, message, ...params) {
        super(...params)
    
        this.name = "HttpError";
        this.status = status;
        this.message = message;
        this.error = message;
      }
}

module.exports = {
    HttpError
};