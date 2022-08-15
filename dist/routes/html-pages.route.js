"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = __importDefault(require("path"));
var express_session_1 = __importDefault(require("express-session"));
var body_parser_1 = __importDefault(require("body-parser"));
var HTMLAccountController_1 = require("../controllers/HTMLAccountController");
var axios_script_1 = require("../scripts/axios-script");
var nodemailer_script_1 = require("../scripts/nodemailer-script");
var __dirname = path_1.default.resolve();
var registerHTML = path_1.default.join(__dirname, '/src/html/register.html');
var registerSuccessufullHTML = path_1.default.join(__dirname, '/src/html/registerSuccessufull.html');
var loginHTML = path_1.default.join(__dirname, '/src/html/login.html');
var homeHTML = path_1.default.join(__dirname, '/src/html/home.html');
var logoutHTML = path_1.default.join(__dirname, 'src/html/logout.html');
var htmlPageRoute = (0, express_1.Router)();
htmlPageRoute.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: false,
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));
htmlPageRoute.use(body_parser_1.default.urlencoded({ extended: true }));
htmlPageRoute.get('/', function (req, res) {
    console.log('Req.session.login NA HOME:', req.session.login);
    res.sendFile(homeHTML);
});
htmlPageRoute.get('/register', function (req, res) {
    res.sendFile(registerHTML);
});
htmlPageRoute.post('/register', new HTMLAccountController_1.HTMLAccountController().createAccountHTML, (0, nodemailer_script_1.sendNodemailer)(), function (req, res) {
    res.sendFile(registerSuccessufullHTML);
});
htmlPageRoute.get('/login', function (req, res) {
    if (req.session.login) {
        console.log('Req session COMPLETO:', req.session);
        console.log('Req sessio login:', req.session.login);
        res.redirect('/');
    }
    else {
        res.sendFile(loginHTML);
    }
});
htmlPageRoute.post('/login', new HTMLAccountController_1.HTMLAccountController().loginAccountHTML, function (req, res) {
});
htmlPageRoute.get('/logout', function (req, res) {
    if (req.session.login) {
        req.session.destroy(req.session.login);
        res.sendFile(logoutHTML);
    }
    else {
        res.redirect('/');
    }
});
htmlPageRoute.get('/email', function (req, res) {
    if (req.session.login) {
        res.json({ message: 'EXISTE !', session: req.session.login });
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
exports.default = htmlPageRoute;
