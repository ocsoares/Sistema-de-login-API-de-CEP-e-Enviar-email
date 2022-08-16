"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var database_1 = require("./database");
var error_middleware_1 = require("./middlewares/error.middleware");
var check_status_route_1 = __importDefault(require("./routes/check-status.route"));
var html_pages_route_1 = __importDefault(require("./routes/html-pages.route"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
database_1.AppDataSource.initialize().then(function () {
    var server = (0, express_1.default)();
    var host = 'http://localhost';
    var port = 5000;
    var __dirname = path_1.default.resolve();
    server.use((0, cors_1.default)());
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: true }));
    server.use(express_1.default.static(__dirname + '/src/public'));
    server.use(express_1.default.static(__dirname + '/fontawesome-free-6.1.2-web/'));
    server.use(express_1.default.static(__dirname + '/dist'));
    server.set('trust proxy', 1);
    server.use(html_pages_route_1.default);
    server.use(check_status_route_1.default);
    server.use(error_middleware_1.errorMiddleware);
    return server.listen(process.env.PORT || port, function () {
        console.log("Servidor online na rota: ".concat(host, ":").concat(port, " !"));
    });
});
