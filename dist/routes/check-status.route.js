"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var StatusServerController_1 = require("../controllers/StatusServerController");
var checkStatusRoute = (0, express_1.Router)();
checkStatusRoute.get('/status', new StatusServerController_1.StatusServerController().checkStatusServer);
exports.default = checkStatusRoute;
