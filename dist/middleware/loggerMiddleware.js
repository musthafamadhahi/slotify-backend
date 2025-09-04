"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSuccess = exports.logInfo = exports.logError = exports.requestLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const requestLogger = (req, res, next) => {
    res.on('finish', () => {
        const method = req.method;
        const url = req.originalUrl;
        const status = res.statusCode;
        const statusColor = status >= 500
            ? chalk_1.default.redBright
            : status >= 400
                ? chalk_1.default.red
                : status >= 300
                    ? chalk_1.default.yellow
                    : chalk_1.default.green;
        console.log(statusColor(`[${method}] ${url} : ${status}`));
    });
    next();
};
exports.requestLogger = requestLogger;
const logError = (err) => {
    if (err instanceof Error) {
        console.error(chalk_1.default.red('[ERROR]'), err.stack);
    }
    else {
        console.error(chalk_1.default.red('[ERROR]'), err);
    }
};
exports.logError = logError;
const logInfo = (...args) => {
    console.log(chalk_1.default.blue('[INFO]'), ...args);
};
exports.logInfo = logInfo;
const logSuccess = (...args) => {
    console.log(chalk_1.default.green('[SUCCESS]'), ...args);
};
exports.logSuccess = logSuccess;
