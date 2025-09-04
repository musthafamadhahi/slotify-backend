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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByPhoneNumber = exports.findUserByEmail = exports.findUserByFirebaseId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByFirebaseId = (firebaseUid) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { firebaseUid },
        select: { email: true, firebaseUid: true },
    });
    console.log('User retrieved from database:', user);
    return user;
});
exports.findUserByFirebaseId = findUserByFirebaseId;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: { email },
    });
});
exports.findUserByEmail = findUserByEmail;
const findUserByPhoneNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: { phoneNumber: phoneNumber },
    });
});
exports.findUserByPhoneNumber = findUserByPhoneNumber;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return yield prisma.user.create({
        data: {
            firebaseUid: (_a = data.firebaseUid) !== null && _a !== void 0 ? _a : '',
            email: data.email,
            phoneNumber: data.phoneNumber,
            name: data.name,
        },
    });
});
exports.createUser = createUser;
