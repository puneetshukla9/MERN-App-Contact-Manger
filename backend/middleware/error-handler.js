const CONSTANTS = require("../constants");
const errorHandler = (err, req, res, next) => {
    switch (res.statusCode) {
        case CONSTANTS.VALIDATION_FAILED:
            res.json({ message: err.message })
            break;
        case CONSTANTS.FORBIDDEN:
            res.json({ message: err.message || "Access Forbidden " })
            break;
        case CONSTANTS.FORBIDDEN:
            res.json({ message: err.message || "Access Denied " })
            break;
        case CONSTANTS.NOT_FOUND:
            res.json({ message: err.message || "Not  Found " })
            break;

        default:
            break;
    }

}
module.exports = errorHandler;