"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = __importDefault(require("path"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var body_parser_1 = __importDefault(require("body-parser"));
var HTMLAccountController_1 = require("../controllers/HTMLAccountController");
var axios_script_1 = require("../scripts/axios-script");
var nodemailer_script_1 = require("../scripts/nodemailer-script");
var __dirname = path_1.default.resolve();
var registerHTML = path_1.default.join(__dirname, '/src/html/register.html');
var registerSuccessufullHTML = path_1.default.join(__dirname, '/src/html/registerSuccessufull.html');
var loginHTML = path_1.default.join(__dirname, '/src/html/login.html');
var homeHTML = path_1.default.join(__dirname, '/src/html/home.html');
var logoutHTML = path_1.default.join(__dirname, '/src/html/logout.html');
var dashboardHTML = path_1.default.join(__dirname, '/src/html/dashboard.html');
var htmlPageRoute = (0, express_1.Router)();
htmlPageRoute.use((0, cookie_session_1.default)({
    secret: process.env.SESSION_SECRET,
    keys: [process.env.SESSION_SECRET],
}));
htmlPageRoute.use(body_parser_1.default.urlencoded({ extended: true }));
htmlPageRoute.get('/', function (req, res) {
    res.sendFile(homeHTML);
});
htmlPageRoute.get('/register', function (req, res) {
    res.sendFile(registerHTML);
});
htmlPageRoute.post('/register', new HTMLAccountController_1.HTMLAccountController().createAccountHTML, (0, nodemailer_script_1.sendNodemailer)(), function (req, res) {
    res.sendFile(registerSuccessufullHTML);
});
htmlPageRoute.get('/login', function (req, res) {
});
htmlPageRoute.post('/login', new HTMLAccountController_1.HTMLAccountController().loginAccountHTML, function (req, res) {
});
htmlPageRoute.get('/dashboard', function (req, res) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.login) {
        res.sendFile(dashboardHTML);
    }
    else {
        res.redirect('/login');
    }
});
htmlPageRoute.get('/logout', function (req, res) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.login) {
        res.clearCookie('session');
        res.sendFile(logoutHTML);
        setInterval(function () {
            res.end();
        }, 25);
    }
    else {
        res.redirect('/');
    }
});
htmlPageRoute.get('/email', function (req, res) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.login) {
        res.json({ name: req.session.login.username, email: req.session.login.email });
    }
    else {
        res.redirect('/login');
    }
});
htmlPageRoute.get('/cep', (0, axios_script_1.runAxios)(), function (req, res) {
});
htmlPageRoute.get('/token', new HTMLAccountController_1.HTMLAccountController().generateJWT, function (req, res) {
});
htmlPageRoute.get('/verifytoken/:JWTObject', new HTMLAccountController_1.HTMLAccountController().verifyJWT, function (req, res) {
});
htmlPageRoute.get('/data', new HTMLAccountController_1.HTMLAccountController().onlyReturnData, function (req, res) {
});
exports.default = htmlPageRoute;
