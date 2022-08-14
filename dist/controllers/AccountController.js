"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var api_error_model_1 = require("../models/api-error.model");
var accountRepository_1 = require("../repositories/accountRepository");
var CPFRepository_1 = require("../repositories/CPFRepository");
var http_status_codes_1 = require("http-status-codes");
var AccountController = (function () {
    function AccountController() {
    }
    AccountController.prototype.createAccount = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, email, cpf, cep, searchCPF, searchEmail, encryptPassword, saveCreatedAccount, saveNameAndCPF;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, username = _a.username, password = _a.password, email = _a.email, cpf = _a.cpf, cep = _a.cep;
                        if (!username || !password || !email || !cpf || !cep)
                            throw new api_error_model_1.BadRequestError('Insira os dados corretamente !');
                        if (typeof (username) !== 'string' || typeof (password) !== 'string' || typeof (email) !== 'string' || typeof (cpf) !== 'string' || typeof (cep) !== 'string')
                            throw new api_error_model_1.BadRequestError('Formato inválido !');
                        return [4, CPFRepository_1.CPFRepository.findOneBy({ cpf: cpf })];
                    case 1:
                        searchCPF = _b.sent();
                        if (searchCPF)
                            throw new api_error_model_1.BadRequestError('Já existe um usuário cadastrado com esse Email ou CPF !');
                        return [4, accountRepository_1.AccountRepository.findOneBy({ email: email })];
                    case 2:
                        searchEmail = _b.sent();
                        if (searchEmail)
                            throw new api_error_model_1.BadRequestError('Já existe um usuário cadastrado com esse Email ou CPF !');
                        return [4, bcrypt_1.default.hash(password, 10)];
                    case 3:
                        encryptPassword = _b.sent();
                        if (!encryptPassword)
                            throw new api_error_model_1.BadRequestError();
                        saveCreatedAccount = accountRepository_1.AccountRepository.create({
                            username: username,
                            email: email,
                            cep: cep,
                            password: encryptPassword
                        });
                        saveNameAndCPF = CPFRepository_1.CPFRepository.create({
                            name: username,
                            cpf: cpf
                        });
                        return [4, accountRepository_1.AccountRepository.save(saveCreatedAccount)];
                    case 4:
                        _b.sent();
                        return [4, CPFRepository_1.CPFRepository.save(saveNameAndCPF)];
                    case 5:
                        _b.sent();
                        return [2, res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "Usu\u00E1rio ".concat(username, " criado com sucesso !") })];
                }
            });
        });
    };
    return AccountController;
}());
exports.AccountController = AccountController;
