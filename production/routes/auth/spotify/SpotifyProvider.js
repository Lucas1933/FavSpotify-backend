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
const HttpClient_1 = __importDefault(require("../../../utils/HttpClient"));
const Utils_1 = __importDefault(require("../../../utils/Utils"));
class SpotifyProvider {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.redirectUri =
            "http://localhost:3000/favspotify/api/auth/callback/spotify";
        this.scope = "user-read-private user-read-email";
        this.state = "";
        this.httpClient = new HttpClient_1.default("https://api.spotify.com/v1");
    }
    getAuthorizationUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setState();
            const query = {
                response_type: "code",
                client_id: this.clientId,
                scope: this.scope,
                redirect_uri: this.redirectUri,
                state: this.state,
            };
            const url = "https://accounts.spotify.com/authorize?" +
                (yield Utils_1.default.objectToQueryString(query));
            return url;
        });
    }
    getAuthorizationToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const concatenatedString = `${this.clientId}:${this.clientSecret}`;
            const buffer = Buffer.from(concatenatedString, "utf-8");
            const body = {
                code: code,
                redirect_uri: this.redirectUri,
                grant_type: "authorization_code",
            };
            const headers = {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + buffer.toString("base64"),
            };
            const token = yield this.httpClient.post("https://accounts.spotify.com/api/token", body, { headers: headers });
            return token;
        });
    }
    getState() {
        return this.state;
    }
    setState() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = yield Utils_1.default.generateRandomString(16);
        });
    }
}
exports.default = SpotifyProvider;
