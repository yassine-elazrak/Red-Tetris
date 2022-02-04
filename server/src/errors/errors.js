class Error {
    constructor(code, message) {
        this.code = code;
        this.message = message;

        throw new Error(this.message);
    }
}