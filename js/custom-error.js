export class InvalidDateFormatError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidDateFormatError";
    }
}
