"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var http_status_codes_1 = require("http-status-codes");
var errorMiddleware = function (error, req, res, next) {
    var _a;
    var statusCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    var message = error.statusCode ? error.message : 'Internal Server Error';
    if (message) {
        return res.status(statusCode).json({ message: message });
    }
    return res.sendStatus(statusCode);
};
exports.errorMiddleware = errorMiddleware;
