class HttpError extends Error {
    constructor(HttpStatus, message, ...params) {
        super(message)
        
        this.name = "HttpError";
        this.HttpStatus = HttpStatus;
        this.message = message;
    }
}

module.exports = {
    HttpError
};