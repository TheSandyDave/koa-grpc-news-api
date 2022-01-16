
//basic custom errors to be thrown depending on what is thrown from mongo
class NotFoundError extends Error {

    message = "entity not found";
    toString = function () {
        return this.message;
    }
};

class ValidationError extends Error {
    message = "invalid entity";
    toString = function () {
        return this.message;
    }
};

class UnknownError extends Error {
    message = "unknown error";
    toString = function () {
        return this.message;
    }
}
module.exports = {
    NotFoundError: NotFoundError,
    ValidationError: ValidationError,
    UnknownError: UnknownError,
}