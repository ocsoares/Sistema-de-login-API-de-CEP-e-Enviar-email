"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AccountController_1 = require("../controllers/AccountController");
var crudRoute = (0, express_1.Router)();
crudRoute.post('/register', new AccountController_1.AccountController().createAccount);
exports.default = crudRoute;
