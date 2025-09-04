"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const webRouter = express_1.default.Router();
webRouter.use('/auth', auth_routes_1.default);
exports.default = webRouter;
