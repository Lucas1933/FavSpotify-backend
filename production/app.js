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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_connection_1 = __importDefault(require("./database/mongo_connection"));
const auth_spotify_1 = __importDefault(require("./routes/auth/spotify/auth_spotify"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_SESSION_SECRET,
    cookie: {
        path: "/favspotify/api/auth",
        httpOnly: true,
        secure: false,
    },
    saveUninitialized: false,
    resave: false,
}));
app.use("/favspotify/api/auth", auth_spotify_1.default);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_connection_1.default)();
    console.log(`[server]: Server is running at http://localhost:${port}`);
}));
