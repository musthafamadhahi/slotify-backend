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
exports.loginController = void 0;
const firebase_1 = __importDefault(require("../../config/firebase"));
const auth_repository_1 = require("./auth.repository");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { idToken, email, phoneNumber, name } = req.body;
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(idToken);
        if (!decodedToken) {
            res.status(401).json({ error: 'Invalid Firebase ID' });
            return;
        }
        const firebaseUid = decodedToken.uid;
        const existingUser = yield (0, auth_repository_1.findUserByFirebaseId)(firebaseUid);
        if (existingUser) {
            res.status(201).json({
                message: 'User already registered',
                user: existingUser,
            });
            return;
        }
        if (phoneNumber && !phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`;
        }
        const newUser = yield (0, auth_repository_1.createUser)({
            firebaseUid,
            email,
            phoneNumber,
            name,
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
        });
        return;
    }
});
exports.loginController = loginController;
