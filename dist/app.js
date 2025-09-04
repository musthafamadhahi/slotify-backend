"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web_routes_1 = __importDefault(require("./web/web.routes"));
const appRouter = express_1.default.Router();
appRouter.use('/web', web_routes_1.default);
exports.default = appRouter;
