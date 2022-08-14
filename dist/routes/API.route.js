"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_status_codes_1 = require("http-status-codes");
var APIRoute = (0, express_1.Router)();
APIRoute.get('/api', function (req, res) {
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: fetch('https://viacep.com.br/ws/02230030/json')
            .then(function (res) { return res; })
            .then(function (data) {
            console.log({ data: data });
            res.json({ message: 'ok' });
        })
    });
});
exports.default = APIRoute;
