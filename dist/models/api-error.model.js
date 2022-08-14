"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.ApiError = void 0;
var http_status_codes_1 = require("http-status-codes");
var ApiError = (function (_super) {
    __extends(ApiError, _super);
    function ApiError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.name = 'ErrorAPI';
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
var BadRequestError = (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        var _this = _super.call(this, message, http_status_codes_1.StatusCodes.BAD_REQUEST) || this;
        _this.name = 'ErrorBadRequest';
        return _this;
    }
    return BadRequestError;
}(ApiError));
exports.BadRequestError = BadRequestError;
var NotFoundError = (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, message, http_status_codes_1.StatusCodes.NOT_FOUND) || this;
        _this.name = 'ErrorNotFound';
        return _this;
    }
    return NotFoundError;
}(ApiError));
exports.NotFoundError = NotFoundError;
var UnauthorizedError = (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = _super.call(this, message, http_status_codes_1.StatusCodes.UNAUTHORIZED) || this;
        _this.name = 'ErrorUnauthorized';
        return _this;
    }
    return UnauthorizedError;
}(ApiError));
exports.UnauthorizedError = UnauthorizedError;
var InternalServerError = (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        var _this = _super.call(this, message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) || this;
        _this.name = 'ErrorInternalServer';
        return _this;
    }
    return InternalServerError;
}(ApiError));
exports.InternalServerError = InternalServerError;
