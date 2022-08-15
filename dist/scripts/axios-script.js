"use strict";
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
exports.runAxios = void 0;
var axios_1 = __importDefault(require("axios"));
var runAxios = function () { return function (req, res, next) {
    if (req.session) {
        var getCEPValue = req.session.cep.replace('-', '');
        var url = "https://viacep.com.br/ws/".concat(getCEPValue, "/json");
        axios_1.default.get(url)
            .then(function (resAxios) {
            var getAllData = __rest(resAxios.data, []);
            var checkErrorAPI = getAllData.hasOwnProperty('erro');
            if (!checkErrorAPI) {
                return res.json(resAxios.data);
            }
            else {
                return res.json({ message: 'CEP inválido !' });
            }
        })
            .catch(function (error) { return console.log("Erro na aplica\u00E7\u00E3ooo: ".concat(error)); });
        next();
    }
    else {
        res.redirect('/login');
    }
}; };
exports.runAxios = runAxios;
