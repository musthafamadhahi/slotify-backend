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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_1 = __importDefault(require("./app"));
const chalk_1 = __importDefault(require("chalk"));
const http_1 = require("http");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const host = (_a = process.env.API_HOST) !== null && _a !== void 0 ? _a : 'localhost';
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 5001;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
}));
// app.use(requestLogger);
app.use(logger_1.default);
app.use('/api', app_1.default);
app.get('/', (_, res) => {
    res.send({ message: 'Hello from API' });
});
app.get('/health', (_, res) => {
    res.send({ message: 'API is healthy' });
});
httpServer.listen(port, host, () => {
    console.log(chalk_1.default.green(`[ ready ] http://${host}:${port}`));
});
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}));
