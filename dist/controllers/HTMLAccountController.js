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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLAccountController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var api_error_model_1 = require("../models/api-error.model");
var accountRepository_1 = require("../repositories/accountRepository");
var CPFRepository_1 = require("../repositories/CPFRepository");
var path_1 = __importDefault(require("path"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_script_1 = require("../scripts/nodemailer-script");
var __dirname = path_1.default.resolve();
var loggedHTML = path_1.default.join(__dirname, '/src/html/loginSuccessufull.html');
var loginErrorHTML = path_1.default.join(__dirname, '/src/html/loginError.html');
var HTMLAccountController = (function () {
    function HTMLAccountController() {
    }
    HTMLAccountController.prototype.createAccountHTML = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var reqBody, username, email, cpf, cep, password, passwordConfirmation, usernameRegex, validateEmail, CPFRegex, CEPRegex, searchUsername, searchEmail, searchCEP, searchCPF, encryptPassword, saveAccountHTML, saveNameAndCPFHTML;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, nodemailer_script_1.sendNodemailer)();
                        reqBody = req.body;
                        username = reqBody.username, email = reqBody.email, cpf = reqBody.cpf, cep = reqBody.cep, password = reqBody.password, passwordConfirmation = reqBody.passwordConfirmation;
                        if (!username || !email || !cpf || !cep || !password)
                            throw new api_error_model_1.BadRequestError('Dados inválidos !');
                        if (typeof (username) !== 'string' || typeof (email) !== 'string' || typeof (cpf) !== 'string' || typeof (cep) !== 'string' || typeof (password) !== 'string')
                            throw new api_error_model_1.BadRequestError('Dados inválidos !');
                        usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i;
                        if (!username.match(usernameRegex))
                            throw new api_error_model_1.BadRequestError('Usuário inválido !');
                        validateEmail = function (mail) {
                            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
                        };
                        if (!validateEmail(email))
                            throw new api_error_model_1.BadRequestError('Email inválido !');
                        CPFRegex = /[0-9]/;
                        if (!cpf.match(CPFRegex))
                            throw new api_error_model_1.BadRequestError('CPF inválido !');
                        CEPRegex = /[0-9]/;
                        if (!cep.match(CEPRegex))
                            throw new api_error_model_1.BadRequestError('CEP inválido !');
                        if (passwordConfirmation !== password)
                            throw new api_error_model_1.BadRequestError('As senhas não coincidem !');
                        return [4, accountRepository_1.AccountRepository.findOneBy({ username: username })];
                    case 1:
                        searchUsername = _a.sent();
                        if (searchUsername)
                            throw new api_error_model_1.BadRequestError('Usuário existente !');
                        return [4, accountRepository_1.AccountRepository.findOneBy({ email: email })];
                    case 2:
                        searchEmail = _a.sent();
                        if (searchEmail)
                            throw new api_error_model_1.BadRequestError('Email existente !');
                        return [4, accountRepository_1.AccountRepository.findOneBy({ cep: cep })];
                    case 3:
                        searchCEP = _a.sent();
                        if (searchCEP)
                            throw new api_error_model_1.BadRequestError('CEP existente !');
                        return [4, CPFRepository_1.CPFRepository.findOneBy({ cpf: cpf })];
                    case 4:
                        searchCPF = _a.sent();
                        if (searchCPF)
                            throw new api_error_model_1.BadRequestError('CPF existente !');
                        return [4, bcrypt_1.default.hash(password, 10)];
                    case 5:
                        encryptPassword = _a.sent();
                        if (!encryptPassword)
                            throw new api_error_model_1.InternalServerError();
                        saveAccountHTML = accountRepository_1.AccountRepository.create({
                            username: username,
                            email: email,
                            cep: cep,
                            password: encryptPassword
                        });
                        saveNameAndCPFHTML = CPFRepository_1.CPFRepository.create({
                            name: username,
                            cpf: cpf
                        });
                        return [4, accountRepository_1.AccountRepository.save(saveAccountHTML)];
                    case 6:
                        _a.sent();
                        return [4, CPFRepository_1.CPFRepository.save(saveNameAndCPFHTML)];
                    case 7:
                        _a.sent();
                        next();
                        return [2];
                }
            });
        });
    };
    HTMLAccountController.prototype.loginAccountHTML = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var reqBody, email, password, searchEmail, searchPassword, _, finalLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reqBody = req.body;
                        email = reqBody.email, password = reqBody.password;
                        if (!email || !password) {
                            return [2, res.sendFile(loginErrorHTML)];
                        }
                        return [4, accountRepository_1.AccountRepository.findOneBy({ email: email })];
                    case 1:
                        searchEmail = _a.sent();
                        if (!searchEmail) {
                            return [2, res.sendFile(loginErrorHTML)];
                        }
                        return [4, bcrypt_1.default.compare(password, searchEmail.password)];
                    case 2:
                        searchPassword = _a.sent();
                        if (!searchPassword) {
                            return [2, res.sendFile(loginErrorHTML)];
                        }
                        _ = searchEmail.password, finalLogin = __rest(searchEmail, ["password"]);
                        req.session = finalLogin;
                        res.sendFile(loggedHTML);
                        next();
                        return [2];
                }
            });
        });
    };
    HTMLAccountController.prototype.generateJWT = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var JWT;
            return __generator(this, function (_b) {
                if (req.session) {
                    JWT = jsonwebtoken_1.default.sign({
                        id: req.session.id,
                        username: req.session.username,
                        email: req.session.email
                    }, (_a = process.env.JWT_HASH) !== null && _a !== void 0 ? _a : '', {
                        expiresIn: '12h'
                    });
                    req.jwt = JWT;
                    res.json({ message: "Seu token \u00E9: ".concat(req.jwt) });
                }
                else {
                    res.redirect('/login');
                }
                next();
                return [2];
            });
        });
    };
    HTMLAccountController.prototype.verifyJWT = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var JWTObject, JWT, verifyJWT;
            return __generator(this, function (_b) {
                if (req.session) {
                    JWTObject = req.params.JWTObject;
                    JWT = JWTObject.split(' ')[0];
                    try {
                        verifyJWT = jsonwebtoken_1.default.verify(JWT, (_a = process.env.JWT_HASH) !== null && _a !== void 0 ? _a : '');
                        if (verifyJWT) {
                            return [2, res.json({
                                    message: 'Token válido !',
                                    id: verifyJWT.id,
                                    username: verifyJWT.username,
                                    email: verifyJWT.email,
                                    iat: verifyJWT.iat,
                                    exp: verifyJWT.exp
                                })];
                        }
                    }
                    catch (error) {
                        res.json({ message: 'Token inválido ou expirado !' });
                    }
                }
                else {
                    res.redirect('/login');
                }
                next();
                return [2];
            });
        });
    };
    return HTMLAccountController;
}());
exports.HTMLAccountController = HTMLAccountController;
