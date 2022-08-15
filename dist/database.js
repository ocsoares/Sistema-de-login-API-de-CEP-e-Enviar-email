"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
require("dotenv/config");
var typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ["".concat(__dirname, "/**/entity/*.{ts,js}")],
    migrations: ["".concat(__dirname, "/**/migration/*.{ts,js}")],
    ssl: process.env.DATABASE_URL ? false : true && {
        rejectUnauthorized: false
    }
});
