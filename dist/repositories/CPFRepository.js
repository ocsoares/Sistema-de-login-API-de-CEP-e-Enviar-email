"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPFRepository = void 0;
var database_1 = require("../database");
var CPF_1 = require("../database/src/entity/CPF");
exports.CPFRepository = database_1.AppDataSource.getRepository(CPF_1.CPF);
