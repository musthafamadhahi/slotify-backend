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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const firebase_1 = __importDefault(require("../config/firebase"));
const prisma = new client_1.PrismaClient();
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    console.log('-------------------------------------------------------------');
    console.log('this is the middleware');
    console.log('authorization code is', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const idToken = authHeader.split(' ')[1];
    try {
        console.log('id token is ', idToken);
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        console.log('decoded token is ', decodedToken);
        const user = yield prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid },
        });
        console.log('user is ', user);
        if (!user) {
            console.log('user is not found');
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
        req.user = {
            id: user.id,
            firebaseId: user.firebaseUid,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
});
exports.authenticate = authenticate;
